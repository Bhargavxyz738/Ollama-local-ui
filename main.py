import ollama
from flask import Flask, render_template, jsonify, request, Response
import json
import os
import re
import uuid
from datetime import datetime
import subprocess

app = Flask(__name__)
CHATS_DIR = "chats"
if not os.path.exists(CHATS_DIR):
    os.makedirs(CHATS_DIR)

client = None
try:
    ollama_host = os.environ.get("OLLAMA_HOST", "http://localhost:11434")
    client = ollama.Client(host=ollama_host)
    client.list() 
    print("Ollama connected.")
except Exception as e:
    client = None
    print("\n---")
    print("Could not connect to Ollama.")
    print(f"   Error: {e}")
    print("   The UI will run, but model-related features will be unavailable.")
    print("---\n")
def build_messages(data):
    messages = []
    if data.get("system"):
        messages.append({'role': 'system', 'content': data["system"]})
    if data.get("history"):
        messages.extend(data["history"])
    messages.append({'role': 'user', 'content': data.get("prompt", "")})
    return messages
def is_safe_path(filename):
    return not (".." in filename or filename.startswith('/'))
@app.route("/")
def home():
    return render_template("index.html")
@app.route("/api/models")
def get_models():
    try:
        command = ["ollama", "list"]
        result_bytes = subprocess.check_output(command)
        result_str = result_bytes.decode('utf-8').strip()
        models_data = []
        lines = result_str.split('\n')
        if len(lines) < 2: return jsonify([])
        for line in lines[1:]:
            parts = re.split(r'\s{2,}', line.strip())
            if len(parts) >= 4:
                models_data.append({'name': parts[0], 'human_size': parts[2]})
        return jsonify(models_data)
    except Exception as e:
        print(f"An unexpected error occurred in get_models: {e}")
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500
@app.route("/generate", methods=['POST'])
def generate():
    if not client: return jsonify({"error": "Ollama client not connected"}), 503
    try:
        data = request.get_json()
        model_name = data.get("model")
        if not model_name: return jsonify({"error": "Model name is required."}), 400
        messages = build_messages(data)
        def stream_response():
            stream = client.chat(model=model_name, messages=messages, stream=True)
            for chunk in stream:
                yield chunk['message']['content']
        return Response(stream_response(), mimetype='text/plain; charset=utf-8')
    except Exception as e:
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
