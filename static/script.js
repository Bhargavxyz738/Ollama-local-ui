document.addEventListener('DOMContentLoaded', () => {
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const sidebar = document.querySelector('.sidebar');
    const newChatBtn = document.getElementById('new-chat-btn');
    const chatContainer = document.getElementById('chat-container');
    const welcomeScreen = document.getElementById('welcome-screen');
    const chatForm = document.getElementById('chat-form');
    const promptInput = document.getElementById('prompt-input');
    const sendBtn = document.getElementById('send-btn');
    const chatHistoryList = document.getElementById('chat-history-list');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const modelSelector = document.getElementById('model-selector');
    const modelSelectorBtn = document.getElementById('model-selector-btn');
    const selectedModelNameEl = document.getElementById('selected-model-name');
    const modelList = document.getElementById('model-list');
    const hljsTheme = document.getElementById('hljs-theme');
    const chatTitleDisplay = document.getElementById('chat-title-display');
    let chatHistory = [];
    let allModels = [];
    let selectedModel = null;
    let currentChatId = null;
    let isGenerating = false;
    const THEME_STORAGE_KEY = 'ollama_ui_theme';
    const DEFAULT_MODEL_STORAGE_KEY = 'ollama_ui_default_model';
    const copyIconSVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 16H6C4.89543 16 4 15.1046 4 14V6C4 4.89543 4.89543 4 6 4H14C15.1046 4 16 4.89543 16 6V8M10 20H18C19.1046 20 20 19.1046 20 18V10C20 8.89543 19.1046 8 18 8H10C8.89543 8 8 8.89543 8 10V18C8 19.1046 8.89543 20 10 20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const checkIconSVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const regenerateIconSVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4V10H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.51 15C4.56279 17.5024 6.89737 19.3331 9.83517 19.825C12.773 20.3168 15.8239 19.3832 17.8999 17.3001C19.9759 15.217 20.8999 12.1601 20.4099 9.22002C19.9199 6.28002 18.0999 4.00002 15.5999 3.00002C13.0999 2.00002 10.1999 2.22002 7.78995 3.63002L1 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const sunIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.22 4.22L5.64 5.64" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18.36 18.36L16.94 16.94" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3 12H5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19 12H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.22 19.78L5.64 18.36" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18.36 5.64L16.94 4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
    const moonIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
    const editIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const deleteIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const starIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;

    function initialize() {
        marked.setOptions({ gfm: true, breaks: true, taskLists: true });
        setupTheme(); addEventListeners(); fetchModels(); loadChatList(); resetChatView();
    }

    function typeEffect(element, text, callback) {
        let i = 0;
        element.innerHTML = '';
        const cursor = `<span class="typing-cursor-title"></span>`;
        element.innerHTML = cursor;

        const typingInterval = setInterval(() => {
            if (i < text.length) {
                element.innerHTML = text.substring(0, i + 1) + cursor;
                i++;
            } else {
                clearInterval(typingInterval);
                element.innerHTML = text;
                if (callback) callback();
            }
        }, 50);
    }

    function setDefaultModel(modelName) {
        localStorage.setItem(DEFAULT_MODEL_STORAGE_KEY, modelName);
        updateDefaultModelUI();
    }

    function updateDefaultModelUI() {
        const defaultModel = localStorage.getItem(DEFAULT_MODEL_STORAGE_KEY);
        document.querySelectorAll('.default-model-btn').forEach(btn => {
            btn.classList.toggle('is-default', btn.dataset.modelName === defaultModel);
        });
    }

    async function fetchModels() {
        try {
            const response = await fetch('/api/models');
            allModels = await response.json();
            
            modelList.innerHTML = '';
            
            const ollamaModels = allModels.filter(m => m.type === 'ollama');
            const geminiModels = allModels.filter(m => m.type === 'gemini');

            if (ollamaModels.length > 0) renderModelSection('Local Models', ollamaModels);
            if (geminiModels.length > 0) renderModelSection('API Models', geminiModels);

            const defaultModelName = localStorage.getItem(DEFAULT_MODEL_STORAGE_KEY);
            const defaultModel = allModels.find(m => m.name === defaultModelName);

            if (defaultModel) {
                selectModel(defaultModel);
            } else if (allModels.length > 0) {
                selectModel(allModels[0]);
            } else {
                selectedModelNameEl.textContent = 'No Models';
            }
            updateDefaultModelUI();
            
        } catch (error) {
            selectedModelNameEl.textContent = 'API Offline';
            console.error("Failed to fetch models:", error);
        }
    }

    function renderModelSection(title, models) {
        const header = document.createElement('div');
        header.className = 'model-list-header';
        header.textContent = title;
        modelList.appendChild(header);

        models.forEach(model => {
            const item = document.createElement('div');
            item.className = 'model-item';
            
            const details = document.createElement('div');
            details.innerHTML = `<span class="model-name">${model.name}</span><span class="model-size">${model.human_size}</span>`;
            item.appendChild(details);

            const starBtn = document.createElement('button');
            starBtn.className = 'default-model-btn';
            starBtn.innerHTML = starIcon;
            starBtn.title = 'Set as default';
            starBtn.dataset.modelName = model.name;
            starBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                setDefaultModel(model.name);
            });
            
            item.appendChild(starBtn);
            item.addEventListener('click', () => selectModel(model));
            modelList.appendChild(item);
        });
    }
    
    function selectModel(model) {
        selectedModel = model.name;
        selectedModelNameEl.textContent = model.name;
        modelList.classList.remove('visible');
        promptInput.focus();
    }

    function preprocessMarkdown(markdownText) {
        if (typeof markdownText !== 'string') return markdownText;
        const pattern = /^([a-zA-Z0-9_+#-]+)\n([\s\S]*?)\n```(?=\n|$)/gm;
        return markdownText.replace(pattern, (match, lang, codeContent) => {
            if (/^[a-zA-Z0-9_+#-]+$/.test(lang) && codeContent.trim().length > 0) {
                return "```" + lang + "\n" + codeContent.trim() + "\n```";
            }
            return match;
        });
    }
    
    async function handleFormSubmit(e) {
        e.preventDefault();
        if (isGenerating || !promptInput.value.trim() || !selectedModel) return;
        
        setGeneratingState(true);
        const userPrompt = promptInput.value.trim();
        const isNewChat = !currentChatId;
        if (isNewChat) currentChatId = `chat_${Date.now()}`;
        
        promptInput.value = ''; handleInput();
        welcomeScreen.style.display = 'none';

        addMessageToUI('user').querySelector('.message-bubble').textContent = userPrompt;
        chatHistory.push({ role: 'user', content: userPrompt });

        const modelMessageWrapper = addMessageToUI('assistant');
        const bubbleEl = modelMessageWrapper.querySelector('.message-bubble');
        bubbleEl.innerHTML = '<span class="thinking-cursor"></span>';
        scrollToBottom();
        
        try {
            const historyForApi = chatHistory.slice(0, -1);
            const streamResult = await streamResponse(bubbleEl, userPrompt, historyForApi);
            
            const assistantMessage = {
                role: 'assistant',
                responses: [streamResult.response],
                activeResponseIndex: 0
            };
            chatHistory.push(assistantMessage);
            
            renderMessageActions(modelMessageWrapper, assistantMessage);
            await saveChat(streamResult.chatTitle);
            
            if (isNewChat) {
                await loadChatList();
                typeEffect(chatTitleDisplay, streamResult.chatTitle);
            }
            updateActiveChatInSidebar(currentChatId);

        } catch (error) { 
            bubbleEl.innerHTML = `<p class="error">An error occurred: ${error.message}</p>`; 
            console.error("Error in handleFormSubmit: ", error);
        } finally {
            setGeneratingState(false);
            promptInput.focus(); 
        }
    }
    
    async function streamResponse(bubbleEl, userPrompt, historyForApi) {
        const startTime = Date.now();
        const isNewChat = historyForApi.length === 0;
        const promptForApi = isNewChat ? `Your FIRST task is to create a concise, 3-5 word title for the following user prompt. The title MUST be enclosed in <title> XML tags. After the closing </title> tag, you MUST provide a complete and helpful answer to the user's prompt.\n\nUser prompt: "${userPrompt}"` : userPrompt;
        
        const response = await fetch('/generate', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: selectedModel, prompt: promptForApi, history: historyForApi }),
        });
        
        if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';
        const titleBlockRegex = /(?:`{2,3}(?:[a-z]+)?\s*\n?)?<title>(.*?)<\/title>(?:\n?\s*`{2,3})?\s*/s;
        const leadingArtifactRegex = /^(\s*`{2,3}\s*(\n\s*)*)+/;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            fullResponse += decoder.decode(value, { stream: true });

            let contentForStreamingDisplay = fullResponse.replace(titleBlockRegex, '');
            contentForStreamingDisplay = contentForStreamingDisplay.replace(leadingArtifactRegex, '');
            contentForStreamingDisplay = preprocessMarkdown(contentForStreamingDisplay.trim());
            
            bubbleEl.innerHTML = marked.parse(contentForStreamingDisplay);
            structureAndHighlightCodeBlocks(bubbleEl);
            scrollToBottom();
        }

        const endTime = Date.now();
        const titleMatch = fullResponse.match(titleBlockRegex);
        const chatTitle = titleMatch 
            ? titleMatch[1].trim() 
            : (isNewChat ? userPrompt.split(' ').slice(0, 5).join(' ') + '...' : document.querySelector(`.chat-history-item.active .chat-title-link`)?.textContent || 'Conversation');
        
        let cleanedResponse = fullResponse.replace(titleBlockRegex, '');
        cleanedResponse = cleanedResponse.replace(leadingArtifactRegex, '').trim();
        cleanedResponse = preprocessMarkdown(cleanedResponse);
        
        const wordCount = cleanedResponse.split(/\s+/).length;
        const totalTime = (endTime - startTime) / 1000;
        
        return {
            response: { content: cleanedResponse, model: selectedModel, stats: { time: totalTime, wps: totalTime > 0 ? (wordCount / totalTime).toFixed(1) : 0 } },
            chatTitle: chatTitle
        };
    }

    function resetChatView() {
        currentChatId = null; chatHistory = []; chatContainer.innerHTML = '';
        chatContainer.appendChild(welcomeScreen); welcomeScreen.style.display = 'flex';
        promptInput.value = ''; handleInput(); promptInput.focus();
        updateActiveChatInSidebar(null);
        chatTitleDisplay.textContent = '';
    }

    async function loadChat(chatId) {
        try {
            const response = await fetch(`/api/chats/${chatId}`);
            const chatData = await response.json();
            currentChatId = chatData.id;
            
            chatHistory = chatData.messages.map(message => {
                if (message.role === 'assistant' && !message.responses) {
                    return {
                        role: 'assistant',
                        responses: [{ content: message.content, model: chatData.model, stats: message.stats || {} }],
                        activeResponseIndex: 0
                    };
                }
                return message;
            });
            
            const modelToSelect = allModels.find(m => m.name === chatData.model);
            if (modelToSelect) selectModel(modelToSelect);

            chatContainer.innerHTML = '';
            welcomeScreen.style.display = 'none';
            chatHistory.forEach(message => {
                const msgWrapper = addMessageToUI(message.role);
                if (message.role === 'user') {
                    msgWrapper.querySelector('.message-bubble').textContent = message.content;
                } else if (message.role === 'assistant') {
                    renderMessageBubble(msgWrapper, message);
                    renderMessageActions(msgWrapper, message);
                }
            });
            updateActiveChatInSidebar(chatId);
            chatTitleDisplay.textContent = chatData.title;
            if (window.innerWidth <= 768) sidebar.classList.add('collapsed');
        } catch (error) { console.error(`Failed to load chat ${chatId}:`, error); }
    }

    function addEventListeners() {
        menuToggleBtn.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
        newChatBtn.addEventListener('click', resetChatView);
        themeToggleBtn.addEventListener('click', toggleTheme);
        modelSelectorBtn.addEventListener('click', () => modelList.classList.toggle('visible'));
        document.addEventListener('click', (e) => {
            if (!modelSelector.contains(e.target)) modelList.classList.remove('visible');
            if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !menuToggleBtn.contains(e.target)) sidebar.classList.add('collapsed');
        });
        chatForm.addEventListener('submit', handleFormSubmit);
        promptInput.addEventListener('input', handleInput);
        promptInput.addEventListener('keydown', handleKeydown);
    }
    
    function setupTheme() {
        hljsTheme.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css';
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'dark-theme';
        document.body.className = savedTheme;
        updateThemeUI(savedTheme);
    }
    
    function toggleTheme() {
        const newTheme = document.body.classList.contains('dark-theme') ? 'light-theme' : 'dark-theme';
        document.body.className = newTheme; localStorage.setItem(THEME_STORAGE_KEY, newTheme); updateThemeUI(newTheme);
    }
    
    function updateThemeUI(theme) { themeToggleBtn.innerHTML = theme === 'dark-theme' ? sunIcon : moonIcon; }
    
    function autoResizeTextarea(textarea) { textarea.style.height = 'auto'; textarea.style.height = `${textarea.scrollHeight}px`; }
    
    function scrollToBottom() { chatContainer.scrollTop = chatContainer.scrollHeight; }
    
    function updateActiveChatInSidebar(chatId) { document.querySelectorAll('.chat-history-item').forEach(item => item.classList.toggle('active', item.dataset.id === chatId)); }
    
    function handleInput() { autoResizeTextarea(promptInput); updateSendButtonState(); }
    
    function handleKeydown(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); chatForm.dispatchEvent(new Event('submit')); } }
    
    function setGeneratingState(generating) {
        isGenerating = generating;
        updateSendButtonState();
        if (!generating) {
            const lastMessageWrapper = chatContainer.querySelector('.message-wrapper:last-of-type.assistant-message');
            if (lastMessageWrapper) {
                const lastMessageObject = chatHistory[chatHistory.length - 1];
                if (lastMessageObject && lastMessageObject.role === 'assistant') {
                    renderMessageActions(lastMessageWrapper, lastMessageObject);
                }
            }
        }
    }
    
    function updateSendButtonState() { sendBtn.disabled = !promptInput.value.trim().length > 0 || isGenerating; }
    
    async function loadChatList() {
        try {
            const response = await fetch('/api/chats');
            const chats = await response.json();
            chatHistoryList.innerHTML = '';
            chats.forEach(chat => {
                const itemContainer = document.createElement('div');
                itemContainer.className = 'chat-history-item';
                itemContainer.dataset.id = chat.id;
                const titleLink = document.createElement('a');
                titleLink.href = '#';
                titleLink.className = 'chat-title-link';
                titleLink.textContent = chat.title;
                titleLink.addEventListener('click', (e) => { e.preventDefault(); loadChat(chat.id); });
                const renameInput = document.createElement('input');
                renameInput.type = 'text';
                renameInput.className = 'rename-input';
                renameInput.value = chat.title;
                renameInput.style.display = 'none';
                renameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') e.target.blur(); });
                renameInput.addEventListener('blur', (e) => {
                    const newTitle = e.target.value.trim();
                    if (newTitle && newTitle !== chat.title) {
                        renameChat(chat.id, newTitle);
                    } else {
                        e.target.style.display = 'none';
                        titleLink.style.display = 'block';
                    }
                });
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'chat-item-actions';
                const renameBtn = document.createElement('button');
                renameBtn.className = 'chat-action-btn';
                renameBtn.innerHTML = editIcon;
                renameBtn.title = 'Rename';
                renameBtn.addEventListener('click', () => {
                    titleLink.style.display = 'none';
                    actionsDiv.style.opacity = 0;
                    renameInput.style.display = 'block';
                    renameInput.focus();
                    renameInput.select();
                });
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'chat-action-btn';
                deleteBtn.innerHTML = deleteIcon;
                deleteBtn.title = 'Delete';
                deleteBtn.addEventListener('click', () => deleteChat(chat.id, chat.title));
                actionsDiv.appendChild(renameBtn);
                actionsDiv.appendChild(deleteBtn);
                itemContainer.appendChild(titleLink);
                itemContainer.appendChild(renameInput);
                itemContainer.appendChild(actionsDiv);
                chatHistoryList.appendChild(itemContainer);
            });
            updateActiveChatInSidebar(currentChatId);
        } catch (error) { console.error("Failed to load chat list:", error); }
    }
    
    async function deleteChat(chatId, title) {
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
            try {
                await fetch(`/api/chats/${chatId}`, { method: 'DELETE' });
                if (currentChatId === chatId) resetChatView();
                loadChatList();
            } catch (error) { console.error('Failed to delete chat:', error); }
        }
    }
    
    async function renameChat(chatId, newTitle) {
        try {
            const response = await fetch(`/api/chats/${chatId}`);
            const chatData = await response.json();
            chatData.title = newTitle;
            await fetch('/api/chats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(chatData) });
            if (currentChatId === chatId) chatTitleDisplay.textContent = newTitle;
            loadChatList();
        } catch (error) { console.error('Failed to rename chat:', error); }
    }
    
    async function saveChat(title) {
        if (!currentChatId) return;
        try {
            const chatData = { id: currentChatId, title: title, model: selectedModel, messages: chatHistory };
            await fetch('/api/chats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(chatData) });
        } catch (error) { console.error("Failed to save chat:", error); }
    }
    
    function addMessageToUI(role) {
        const wrapper = document.createElement('div');
        wrapper.className = `message-wrapper ${role}-message`;
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        wrapper.appendChild(bubble);
        if (role === 'assistant') {
            const actions = document.createElement('div');
            actions.className = 'message-actions';
            wrapper.appendChild(actions);
        }
        chatContainer.appendChild(wrapper);
        scrollToBottom();
        return wrapper;
    }
    
    async function handleRegenerate() {
        if (isGenerating || chatHistory.length < 2) return;
        setGeneratingState(true);
        
        const userMessageIndex = chatHistory.length - 2;
        const assistantMessageIndex = chatHistory.length - 1;

        if (chatHistory[userMessageIndex].role !== 'user' || chatHistory[assistantMessageIndex].role !== 'assistant') {
            setGeneratingState(false);
            return;
        }
        
        const lastUserMessage = chatHistory[userMessageIndex];
        const assistantMessageObject = chatHistory[assistantMessageIndex];
        
        const modelMessageWrapper = Array.from(chatContainer.querySelectorAll('.assistant-message')).pop();
        if (!modelMessageWrapper) {
            setGeneratingState(false); return;
        }
        const bubbleEl = modelMessageWrapper.querySelector('.message-bubble');
        
        bubbleEl.innerHTML = '<span class="thinking-cursor"></span>';
        scrollToBottom();
        
        try {
            const historyForApi = chatHistory.slice(0, userMessageIndex + 1);
            const streamResult = await streamResponse(bubbleEl, lastUserMessage.content, historyForApi);
            
            assistantMessageObject.responses.push(streamResult.response);
            assistantMessageObject.activeResponseIndex = assistantMessageObject.responses.length - 1;
            
            renderMessageActions(modelMessageWrapper, assistantMessageObject);
            
            const currentChatTitle = document.querySelector(`.chat-history-item.active .chat-title-link`)?.textContent || streamResult.chatTitle || 'Conversation';
            await saveChat(currentChatTitle);

        } catch (error) {
            bubbleEl.innerHTML = `<p class="error">An error occurred: ${error.message}</p>`;
        } finally {
            setGeneratingState(false);
            promptInput.focus();
        }
    }
    
    function renderMessageBubbleContent(bubble, content) {
        bubble.innerHTML = marked.parse(content || '');
    }

    function structureAndHighlightCodeBlocks(bubble) {
        bubble.querySelectorAll('table').forEach(table => {
            if (!table.parentElement || table.parentElement.className !== 'table-wrapper') {
                const tableWrapper = document.createElement('div');
                tableWrapper.className = 'table-wrapper';
                table.parentNode.insertBefore(tableWrapper, table);
                tableWrapper.appendChild(table);
            }
        });

        bubble.querySelectorAll('pre > code').forEach(codeElement => {
            const preElement = codeElement.parentElement;
            if (preElement.classList.contains('code-block-processed')) return;

            const langArray = Array.from(codeElement.classList).filter(cls => cls.startsWith('language-'));
            const lang = langArray.length > 0 ? langArray[0].replace('language-', '').toLowerCase() : null;
            const language = lang || 'text';
            const header = document.createElement('div');
            header.className = 'code-block-header';
            const langSpan = document.createElement('span');
            langSpan.className = 'code-block-language';
            langSpan.textContent = language;
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-code-btn';
            copyBtn.innerHTML = copyIconSVG;
            copyBtn.title = 'Copy code';
            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'code-block-content';
            contentWrapper.appendChild(codeElement); 
            preElement.innerHTML = ''; 
            preElement.appendChild(header);
            preElement.appendChild(contentWrapper);
            header.appendChild(langSpan);
            header.appendChild(copyBtn);
            hljs.highlightElement(codeElement);
            preElement.classList.add('code-block-processed');

            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(codeElement.innerText).then(() => {
                    copyBtn.innerHTML = checkIconSVG;
                    setTimeout(() => { copyBtn.innerHTML = copyIconSVG; }, 2000);
                });
            });
        });
    }
    
    function renderMessageBubble(wrapper, messageObject) {
        const bubble = wrapper.querySelector('.message-bubble');
        const activeResponse = messageObject.responses[messageObject.activeResponseIndex];
        const preprocessedContent = preprocessMarkdown(activeResponse.content);
        renderMessageBubbleContent(bubble, preprocessedContent);
        structureAndHighlightCodeBlocks(bubble);
    }
    
    function renderMessageActions(wrapper, messageObject) {
        const actions = wrapper.querySelector('.message-actions');
        if (!actions) return;
        actions.innerHTML = '';
        const activeIndex = messageObject.activeResponseIndex;
        const activeResponse = messageObject.responses[activeIndex];
        if (messageObject.responses.length > 1) {
            const pager = document.createElement('div');
            pager.className = 'regeneration-pager';
            const prevBtn = document.createElement('button');
            prevBtn.className = 'pager-btn'; prevBtn.innerHTML = `<`; prevBtn.disabled = activeIndex === 0;
            prevBtn.title = 'Previous response';
            prevBtn.addEventListener('click', () => {
                messageObject.activeResponseIndex--;
                renderMessageBubble(wrapper, messageObject);
                renderMessageActions(wrapper, messageObject);
                const currentTitle = document.querySelector(`.chat-history-item.active .chat-title-link`)?.textContent || 'Conversation';
                saveChat(currentTitle);
            });
            const status = document.createElement('span');
            status.className = 'pager-status'; status.textContent = `${activeIndex + 1} / ${messageObject.responses.length}`;
            const nextBtn = document.createElement('button');
            nextBtn.className = 'pager-btn'; nextBtn.innerHTML = `>`; nextBtn.disabled = activeIndex === messageObject.responses.length - 1;
            nextBtn.title = 'Next response';
            nextBtn.addEventListener('click', () => {
                messageObject.activeResponseIndex++;
                renderMessageBubble(wrapper, messageObject);
                renderMessageActions(wrapper, messageObject);
                const currentTitle = document.querySelector(`.chat-history-item.active .chat-title-link`)?.textContent || 'Conversation';
                saveChat(currentTitle);
            });
            pager.appendChild(prevBtn); pager.appendChild(status); pager.appendChild(nextBtn);
            actions.appendChild(pager);
        }
        const modelTag = document.createElement('span');
        modelTag.className = 'model-tag';
        modelTag.textContent = activeResponse.model;
        actions.appendChild(modelTag);
        if (activeResponse.stats) {
            if (activeResponse.stats.time) {
                const timeStat = document.createElement('span');
                timeStat.className = 'generation-stat';
                timeStat.textContent = `in ${activeResponse.stats.time.toFixed(1)}s`;
                actions.appendChild(timeStat);
            }
            if (activeResponse.stats.wps) {
                const wpsStat = document.createElement('span');
                wpsStat.className = 'generation-stat';
                wpsStat.textContent = `${activeResponse.stats.wps} w/s`;
                actions.appendChild(wpsStat);
            }
        }
        const copyFullBtn = document.createElement('button');
        copyFullBtn.className = 'action-btn'; copyFullBtn.innerHTML = copyIconSVG;
        copyFullBtn.title = "Copy full response";
        copyFullBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(activeResponse.content).then(() => {
                copyFullBtn.innerHTML = checkIconSVG;
                setTimeout(() => { copyFullBtn.innerHTML = copyIconSVG; }, 2000);
            });
        });
        actions.appendChild(copyFullBtn);
        const isAbsolutelyLast = chatHistory.indexOf(messageObject) === chatHistory.length - 1;
        if (isAbsolutelyLast && !isGenerating) {
            const regenerateBtn = document.createElement('button');
            regenerateBtn.className = 'action-btn regenerate-btn';
            regenerateBtn.innerHTML = regenerateIconSVG;
            regenerateBtn.title = "Regenerate response";
            regenerateBtn.addEventListener('click', handleRegenerate);
            actions.appendChild(regenerateBtn);
        }
    }

    initialize();
});
