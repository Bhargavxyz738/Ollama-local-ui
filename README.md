# Local Ollama Web UI

A sleek, feature-rich, and entirely local web interface for interacting with your Ollama models. This UI provides a user-friendly, ChatGPT-like experience with advanced features like conversation forking, code previewing, and persistent chat history, all running on your own machine.

## Features

-   **Modern Chat Interface:** Clean, responsive, and intuitive UI for seamless conversations.
-   **Local First:** Connects directly to your local Ollama instance. All data stays on your machine.
-   **Persistent Chat History:** Conversations are automatically saved as JSON files in a `chats/` directory.
-   **Full Conversation Management:**
    -   **Rename:** Easily rename conversations from the sidebar.
    -   **Delete:** Remove conversations you no longer need.
-   **Conversation Forking (Regeneration):**
    -   Regenerate any assistant response in the chat history.
    -   This **forks the conversation**, discarding all subsequent messages to create a new conversational branch.
-   **Advanced Code Blocks:**
    -   **Terminal Theme:** A beautiful, dark terminal style for all code blocks, consistent across both light and dark UI themes.
    -   **Syntax Highlighting:** Powered by `highlight.js`.
    -   **Language Detection:** Automatically detects and labels the programming language.
    -   **One-Click Copy:** Easily copy individual code snippets.
-   **Live HTML Preview:** If the model generates HTML, CSS, and/or JavaScript, a "Preview HTML" button appears, opening the rendered output in a new window.
-   **Generation Stats:** See the model's performance with words-per-second and total generation time displayed for each response.
-   **Theme Toggle:** Switch between a polished dark mode and a clean light mode.
-   **Dynamic Model Selector:** Automatically lists and allows you to switch between all of your available Ollama models.

## Tech Stack

-   **Backend:** Python 3, Flask, Ollama Python Library
-   **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3 (No frameworks)
-   **Dependencies:**
    -   `marked.js` for robust Markdown-to-HTML parsing.
    -   `highlight.js` for syntax highlighting in code blocks.

## Getting Started

Follow these instructions to get the web UI up and running on your local machine.

### Prerequisites

1.  **Python 3.x:** Make sure you have Python installed. You can check by running `python --version`.
2.  **Ollama:** You must have Ollama installed and running. Visit the [Ollama official website](https://ollama.com/) for installation instructions.
3.  **A Local Model:** You need at least one model pulled. You can get one by running:
    ```sh
    ollama run ollama run llama3.2:1b-instruct-q4_1
    ```

### Installation & Running

1.  **Clone the Repository**
    ```sh
    git clone https://github.com/Bhargavxyz738/Ollama-local-ui.git
    cd https://github.com/Bhargavxyz738/Ollama-local-ui.git
    ```

2.  **Set Up a Virtual Environment (Recommended)**
    ```sh
    # Create the virtual environment
    python -m venv venv

    # Activate it
    # On macOS/Linux:
    source venv/bin/activate
    # On Windows:
    .\venv\Scripts\activate
    ```

3.  **Install Dependencies**
    With your virtual environment active, install the required Python packages:
    ```sh
    pip install -r requirements.txt
    ```

4.  **Run the Application**
    Make sure your Ollama application is running in the background. Then, start the Flask server:
    ```sh
    python main.py
    ```

5.  **Open the UI**
    Open your web browser and navigate to:
    [http://127.0.0.1:5000](http://127.0.0.1:5000)

You should now see the web interface, ready to chat!

## Project Structure

```
.
├── chats/                # Auto-generated to store chat session JSON files
├── static/
│   ├── script.js         # Core frontend logic, DOM manipulation, API calls
│   └── style.css         # All styling for the application
├── templates/
│   └── index.html        # The main HTML structure
├── main.py               # Flask backend server and API endpoints
├── README.md             # This file
└── requirements.txt      # Python dependencies
```

## How It Works

### Backend (Flask)

The `main.py` script serves a simple but powerful API:
-   `/`: Serves the `index.html` file.
-   `/api/models`: Executes `ollama list` to get all available local models.
-   `/api/chats`: Handles GET (list all chats), POST (save/update a chat), and DELETE requests for managing conversation files in the `chats/` directory.
-   `/generate`: The core endpoint that takes a model, prompt, and history, and streams the response back from the Ollama engine.

### Frontend (JavaScript)

The `static/script.js` file manages the entire UI without any frontend frameworks:
-   **State Management:** Keeps track of the current conversation history, selected model, and UI state.
-   **API Communication:** Uses the `fetch` API to communicate with the Flask backend for loading models, managing chats, and generating responses.
-   **Dynamic DOM Manipulation:** Builds, updates, and removes all UI elements (messages, sidebar items, etc.) on the fly.
-   **Event Handling:** Manages all user interactions, from sending a message to renaming a chat or regenerating a response.
-   **Regeneration Logic:** When a regeneration is triggered, the script intelligently truncates the `chatHistory` array and the corresponding DOM elements before calling the `streamResponse` function to create a new conversation branch.
