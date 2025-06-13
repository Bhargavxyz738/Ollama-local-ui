import ollama
from flask import Flask, render_template, jsonify, request, Response
import json
import os
import re
import subprocess 

try:
    import google.generativeai as genai
    print("Google Generative AI SDK found.")
except ImportError:
    genai = None
    print("Google Generative AI SDK not found. To use Gemini models, please `pip install google-generativeai`.")

app = Flask(__name__)
CHATS_DIR = "chats"
if not os.path.exists(CHATS_DIR):
    os.makedirs(CHATS_DIR)

ollama_host = os.environ.get("OLLAMA_HOST", "http://localhost:11434")
ollama_client = ollama.Client(host=ollama_host)

gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    print("GEMINI_API_KEY environment variable not found. Gemini models will be unavailable.")
elif genai is None:
    print("Gemini API key found, but the SDK is not installed. Gemini models will be unavailable.")
else:
    try:
        genai.configure(api_key=gemini_api_key)
        genai.list_models()
        print("Gemini API configured and connected successfully.")
    except Exception as e:
        genai = None
        print(f"\n--- Failed to configure Gemini API. Error: {e} ---\n")

def build_messages(data):
    messages = []
    if data.get("system"):
        messages.append({'role': 'system', 'content': data["system"]})
    messages.extend(data.get("history", []))
    messages.append({'role': 'user', 'content': data.get("prompt", "")})
    return messages

def is_safe_path(filename):
    return not (".." in filename or filename.startswith('/'))

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/models")
def get_models():
    all_models = []
    try:
        command = ["ollama", "list"]
        result_bytes = subprocess.check_output(command)
        result_str = result_bytes.decode('utf-8').strip()
        lines = result_str.split('\n')
        if len(lines) >= 2:
            for line in lines[1:]: # Skip header
                parts = re.split(r'\s{2,}', line.strip())
                if len(parts) >= 3:
                    all_models.append({
                        'name': parts[0],
                        'human_size': parts[2], 
                        'type': 'ollama'
                    })
        print("Successfully fetched Ollama models via subprocess.")
    except (FileNotFoundError, subprocess.CalledProcessError) as e:
        print(f"Could not fetch Ollama models via subprocess (Ollama may not be running or in PATH): {e}")
    except Exception as e:
        print(f"An unexpected error occurred fetching Ollama models: {e}")

    if gemini_api_key and genai:
        try:
            gemini_models_list = genai.list_models()
            for model in gemini_models_list:
                if 'generateContent' in model.supported_generation_methods:
                    all_models.append({
                        'name': model.name,
                        'human_size': 'API',
                        'type': 'gemini'
                    })
            print("Successfully fetched Gemini models.")
        except Exception as e:
            print(f"Could not fetch Gemini models from API: {e}")

    all_models.sort(key=lambda x: (x['type'], x['name']))
    return jsonify(all_models)

@app.route("/generate", methods=['POST'])
def generate():
    data = request.get_json()
    model_name = data.get("model")
    if not model_name:
        return jsonify({"error": "Model name is required."}), 400

    if 'gemini' in model_name:
        if not gemini_api_key or not genai:
            return jsonify({"error": "Gemini API not configured or available."}), 503
        try:
            model = genai.GenerativeModel(model_name)
            gemini_history = []
            for msg in data.get("history", []):
                role = 'model' if msg.get('role') == 'assistant' else 'user'
                content = ""
                if msg.get('role') == 'user':
                    content = msg.get('content', '')
                elif msg.get('role') == 'assistant':
                    try:
                        active_response_index = msg.get('activeResponseIndex', 0)
                        content = msg.get('responses', [])[active_response_index].get('content', '')
                    except (IndexError, KeyError, TypeError) as e:
                        print(f"Warning: Could not parse assistant message in history: {e}")
                        content = "" 
                if content:
                    gemini_history.append({'role': role, 'parts': [content]})
            prompt = data.get("prompt", "")
            chat_session = model.start_chat(history=gemini_history)
            def stream_gemini_response():
                stream = chat_session.send_message(prompt, stream=True)
                for chunk in stream:
                    if chunk.text:
                        yield chunk.text
            return Response(stream_gemini_response(), mimetype='text/plain; charset=utf-8')
        except Exception as e:
            print(f"Gemini generation error: {e}")
            return jsonify({"error": str(e)}), 500
    else:
        try:
            messages = build_messages(data)
            def stream_ollama_response():
                stream = ollama_client.chat(model=model_name, messages=messages, stream=True)
                for chunk in stream:
                    yield chunk['message']['content']
            return Response(stream_ollama_response(), mimetype='text/plain; charset=utf-8')
        except Exception as e:
            print(f"Ollama generation error: {e}")
            return jsonify({"error": str(e)}), 500

@app.route('/api/chats', methods=['GET'])
def get_chat_list():
    chats = []
    try:
        files = sorted(
            [f for f in os.listdir(CHATS_DIR) if f.endswith(".json")],
            key=lambda f: os.path.getmtime(os.path.join(CHATS_DIR, f)),
            reverse=True
        )
        for filename in files:
            filepath = os.path.join(CHATS_DIR, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
                chats.append({'id': data.get('id'), 'title': data.get('title', 'Untitled Chat')})
    except Exception as e:
        return jsonify({"error": "Could not retrieve chat list."}), 500
    return jsonify(chats)

@app.route('/api/chats/<chat_id>', methods=['GET'])
def get_chat_history(chat_id):
    if not is_safe_path(chat_id): return jsonify({"error": "Invalid chat ID"}), 400
    filepath = os.path.join(CHATS_DIR, f"{chat_id}.json")
    if not os.path.exists(filepath): return jsonify({"error": "Chat not found"}), 404
    with open(filepath, 'r', encoding='utf-8') as f:
        chat_data = json.load(f)
    return jsonify(chat_data)

@app.route('/api/chats', methods=['POST'])
def save_chat():
    data = request.get_json()
    chat_id = data.get('id')
    if not chat_id or not is_safe_path(chat_id):
        return jsonify({"error": "Invalid or missing chat ID"}), 400
    filepath = os.path.join(CHATS_DIR, f"{chat_id}.json")
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        return jsonify({"status": "success", "id": chat_id}), 200
    except Exception as e:
        return jsonify({"error": "Failed to save chat"}), 500

@app.route('/api/chats/<chat_id>', methods=['DELETE'])
def delete_chat(chat_id):
    if not is_safe_path(chat_id):
        return jsonify({"error": "Invalid chat ID"}), 400
    filepath = os.path.join(CHATS_DIR, f"{chat_id}.json")
    if os.path.exists(filepath):
        try:
            os.remove(filepath)
            return jsonify({"status": "success", "id": chat_id}), 200
        except Exception as e:
            return jsonify({"error": f"Failed to delete chat: {e}"}), 500
    else:
        return jsonify({"error": "Chat not found"}), 404

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000, debug=True)
