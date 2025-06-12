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
    let chatHistory = []; let selectedModel = null; let currentChatId = null; let isGenerating = false;
    const THEME_STORAGE_KEY = 'ollama_ui_theme';
    const copyIconSVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 16H6C4.89543 16 4 15.1046 4 14V6C4 4.89543 4.89543 4 6 4H14C15.1046 4 16 4.89543 16 6V8M10 20H18C19.1046 20 20 19.1046 20 18V10C20 8.89543 19.1046 8 18 8H10C8.89543 8 8 8.89543 8 10V18C8 19.1046 8.89543 20 10 20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const checkIconSVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const regenerateIconSVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4V10H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.51 15C4.56279 17.5024 6.89737 19.3331 9.83517 19.825C12.773 20.3168 15.8239 19.3832 17.8999 17.3001C19.9759 15.217 20.8999 12.1601 20.4099 9.22002C19.9199 6.28002 18.0999 4.00002 15.5999 3.00002C13.0999 2.00002 10.1999 2.22002 7.78995 3.63002L1 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const sunIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.22 4.22L5.64 5.64" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18.36 18.36L16.94 16.94" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3 12H5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19 12H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.22 19.78L5.64 18.36" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18.36 5.64L16.94 4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
    const moonIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
    const editIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const deleteIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    function initialize() {
        marked.setOptions({ gfm: true, breaks: true });
        setupTheme(); 
        addEventListeners(); 
        fetchModels(); 
        loadChatList(); 
        resetChatView();
    }

    function parseMarkdown(text) {
        const fixedText = text.replace(/^( *[-*] ?)(?=\S)/gm, '$1 ');
        return marked.parse(fixedText);
    }

    function addEventListeners() {
        menuToggleBtn.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
        newChatBtn.addEventListener('click', resetChatView);
        themeToggleBtn.addEventListener('click', toggleTheme);
        modelSelectorBtn.addEventListener('click', () => modelList.classList.toggle('visible'));
        document.addEventListener('click', (e) => {
            if (!modelSelector.contains(e.target)) modelList.classList.remove('visible');
            if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !menuToggleBtn.contains(e.target) && !e.target.closest('.sidebar')) sidebar.classList.add('collapsed');
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
        document.body.className = newTheme;
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
        updateThemeUI(newTheme);
    }
    function updateThemeUI(theme) {
        themeToggleBtn.innerHTML = theme === 'dark-theme' ? sunIcon : moonIcon;
    }
    async function fetchModels() {
        try {
            const response = await fetch('/api/models');
            const models = await response.json();
            if (models.error) throw new Error(models.error);
            modelList.innerHTML = '';
            if (models.length > 0) {
                models.forEach(model => {
                    const item = document.createElement('div');
                    item.className = 'model-item';
                    item.innerHTML = `<span class="model-name">${model.name}</span><span class="model-size">${model.human_size}</span>`;
                    item.addEventListener('click', () => selectModel(model));
                    modelList.appendChild(item);
                });
                selectModel(models[0]);
            } else { selectedModelNameEl.textContent = 'No Models'; }
        } catch (error) { selectedModelNameEl.textContent = 'Ollama Offline'; console.error("Failed to fetch models:", error); }
    }
    function selectModel(model) {
        selectedModel = model.name;
        selectedModelNameEl.textContent = model.name;
        modelList.classList.remove('visible');
        promptInput.focus();
    }
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
            
            await fetch('/api/chats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(chatData)
            });
            loadChatList();
        } catch (error) { console.error('Failed to rename chat:', error); }
    }

    async function loadChat(chatId) {
        try {
            const response = await fetch(`/api/chats/${chatId}`);
            const chatData = await response.json();
            currentChatId = chatData.id;
            chatHistory = chatData.messages;
            if (chatData.model && Array.from(modelList.children).some(item => item.querySelector('.model-name').textContent === chatData.model)) {
                selectModel({ name: chatData.model });
            }
            chatContainer.innerHTML = '';
            welcomeScreen.style.display = 'none';
            chatHistory.forEach((message, index) => {
                const isLastMessage = index === chatHistory.length - 1;
                const msgWrapper = addMessageToUI(message.role, message.content);
                if (message.role === 'assistant') {
                    finalizeMessage(msgWrapper, message.content, { 
                        model: chatData.model,
                        ...message.stats 
                    }, isLastMessage);
                }
            });
            updateActiveChatInSidebar(chatId);
            if (window.innerWidth <= 768) sidebar.classList.add('collapsed');
        } catch (error) { console.error(`Failed to load chat ${chatId}:`, error); }
    }
    
    function resetChatView() {
        currentChatId = null; chatHistory = []; chatContainer.innerHTML = '';
        chatContainer.appendChild(welcomeScreen); welcomeScreen.style.display = 'flex';
        promptInput.value = ''; handleInput(); promptInput.focus();
        updateActiveChatInSidebar(null);
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        if (isGenerating || !promptInput.value.trim() || !selectedModel) return;
        const userPrompt = promptInput.value.trim();
        const isNewChat = !currentChatId;
        if (isNewChat) currentChatId = `chat_${Date.now()}`;
        isGenerating = true; updateSendButtonState(); promptInput.value = ''; handleInput();
        welcomeScreen.style.display = 'none';
        const lastMessageActions = document.querySelector('.model-message:last-of-type .message-actions');
        if (lastMessageActions) {
            const regenBtn = lastMessageActions.querySelector('.regenerate-btn');
            if (regenBtn) regenBtn.remove();
        }

        addMessageToUI('user', userPrompt);
        chatHistory.push({ role: 'user', content: userPrompt });
        const modelMessageWrapper = addMessageToUI('assistant', '');
        const thinkingCursor = document.createElement('span');
        thinkingCursor.className = 'thinking-cursor';
        modelMessageWrapper.querySelector('.message-bubble').appendChild(thinkingCursor);
        scrollToBottom();
        try {
            await streamResponse(modelMessageWrapper, userPrompt, isNewChat);
        } catch (error) { modelMessageWrapper.querySelector('.message-bubble').innerHTML = `<p class="error">An error occurred: ${error.message}</p>`; }
        finally { isGenerating = false; updateSendButtonState(); promptInput.focus(); }
    }

    async function handleRegenerate() {
        if (isGenerating || chatHistory.length < 2) return;

        isGenerating = true;
        updateSendButtonState();
        
        chatHistory.pop();
        const lastUserMessage = chatHistory[chatHistory.length - 1];
        if (lastUserMessage.role !== 'user') {
            isGenerating = false;
            updateSendButtonState();
            return;
        }
        
        const messageWrappers = document.querySelectorAll('.message-wrapper');
        if (messageWrappers.length > 0) {
            messageWrappers[messageWrappers.length - 1].remove();
        }
    
        const modelMessageWrapper = addMessageToUI('assistant', '');
        const thinkingCursor = document.createElement('span');
        thinkingCursor.className = 'thinking-cursor';
        modelMessageWrapper.querySelector('.message-bubble').appendChild(thinkingCursor);
        scrollToBottom();
    
        try {
            await streamResponse(modelMessageWrapper, lastUserMessage.content, false);
        } catch (error) {
            modelMessageWrapper.querySelector('.message-bubble').innerHTML = `<p class="error">An error occurred: ${error.message}</p>`;
        } finally {
            isGenerating = false;
            updateSendButtonState();
            promptInput.focus();
        }
    }

    async function streamResponse(messageWrapper, userPrompt, isNewChat) {
        const startTime = Date.now();
        const promptForApi = isNewChat 
            ? `Your FIRST task is to create a concise, 3-5 word title for the following user prompt. The title MUST be enclosed in <title> XML tags. After the closing </title> tag, you MUST provide a complete and helpful answer to the user's prompt.\n\nUser prompt: "${userPrompt}"` 
            : userPrompt;
        
        const response = await fetch('/generate', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: selectedModel, prompt: promptForApi, history: isNewChat ? [] : chatHistory.slice(0, -1) }),
        });

        if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';
        const bubbleEl = messageWrapper.querySelector('.message-bubble');
        bubbleEl.innerHTML = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            fullResponse += decoder.decode(value, { stream: true });
            let displayResponse = fullResponse.replace(/<title>.*?<\/title>/, '').trim();
            bubbleEl.innerHTML = parseMarkdown(displayResponse);
            scrollToBottom();
        }

        const endTime = Date.now();
        
        let chatTitle;
        const titleMatch = fullResponse.match(/<title>(.*?)<\/title>/);
        if (titleMatch && titleMatch[1] && titleMatch[1].trim()) {
            chatTitle = titleMatch[1].trim();
        } else {
            if (isNewChat) {
                chatTitle = userPrompt.split(' ').slice(0, 5).join(' ');
                if (userPrompt.split(' ').length > 5) chatTitle += '...';
            } else {
                const currentChat = document.querySelector(`.chat-history-item[data-id="${currentChatId}"] .chat-title-link`);
                chatTitle = currentChat ? currentChat.textContent : 'Conversation';
            }
        }

        const cleanedResponse = fullResponse.replace(/<title>.*?<\/title>/, '').trim();
        const wordCount = cleanedResponse.split(/\s+/).length;
        const totalTime = (endTime - startTime) / 1000;
        const wordsPerSecond = (wordCount / totalTime).toFixed(1);
        
        const stats = { time: totalTime, wps: wordsPerSecond };
        chatHistory.push({
            role: 'assistant',
            content: cleanedResponse,
            stats: stats
        });
        
        finalizeMessage(messageWrapper, cleanedResponse, { model: selectedModel, ...stats }, true);
        await saveChat(chatTitle);
        await loadChatList();
        updateActiveChatInSidebar(currentChatId);
    }

    async function saveChat(title) {
        if (!currentChatId) return;
        try {
            await fetch('/api/chats', { method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: currentChatId, title: title, model: selectedModel, messages: chatHistory })
            });
        } catch (error) { console.error("Failed to save chat:", error); }
    }
    function handleInput() { autoResizeTextarea(promptInput); updateSendButtonState(); }
    function updateSendButtonState() { sendBtn.disabled = !promptInput.value.trim().length > 0 || isGenerating; }
    function handleKeydown(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); chatForm.dispatchEvent(new Event('submit')); } }
    function autoResizeTextarea(textarea) { textarea.style.height = 'auto'; textarea.style.height = `${textarea.scrollHeight}px`; }
    function scrollToBottom() { chatContainer.scrollTop = chatContainer.scrollHeight; }
    function escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
    function updateActiveChatInSidebar(chatId) { document.querySelectorAll('.chat-history-item').forEach(item => item.classList.toggle('active', item.dataset.id === chatId)); }

    function addMessageToUI(role, content) {
        const wrapper = document.createElement('div');
        wrapper.className = `message-wrapper ${role}-message`;
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.innerHTML = role === 'user' ? escapeHtml(content) : parseMarkdown(content);
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

    function finalizeMessage(wrapper, content, stats = {}, isLastMessage = false) {
        const bubble = wrapper.querySelector('.message-bubble');
        bubble.innerHTML = parseMarkdown(content);
        
        bubble.querySelectorAll('table').forEach(table => {
            if (table.parentElement.className !== 'table-wrapper') {
                const tableWrapper = document.createElement('div');
                tableWrapper.className = 'table-wrapper';
                table.parentNode.insertBefore(tableWrapper, table);
                tableWrapper.appendChild(table);
            }
        });

        let htmlCode = '', cssCode = '', jsCode = '';
        bubble.querySelectorAll('pre code').forEach(codeElement => {
            const lang = (Array.from(codeElement.classList).find(cls => cls.startsWith('language-')) || '').replace('language-', '').toLowerCase();
            if (lang === 'html') htmlCode += codeElement.innerText;
            if (lang === 'css') cssCode += codeElement.innerText;
            if (lang === 'javascript' || lang === 'js') jsCode += codeElement.innerText;
            const preElement = codeElement.parentElement;
            const language = lang || 'text';
            const header = document.createElement('div');
            header.className = 'code-block-header';
            const langSpan = document.createElement('span');
            langSpan.className = 'code-block-language';
            langSpan.textContent = language;
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-code-btn'; copyBtn.innerHTML = copyIconSVG; copyBtn.title = 'Copy code';
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(codeElement.innerText).then(() => {
                    copyBtn.innerHTML = checkIconSVG;
                    setTimeout(() => { copyBtn.innerHTML = copyIconSVG; }, 2000);
                });
            });
            header.appendChild(langSpan); header.appendChild(copyBtn);
            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'code-block-content';
            contentWrapper.appendChild(codeElement.cloneNode(true));
            preElement.innerHTML = '';
            preElement.appendChild(header);
            preElement.appendChild(contentWrapper);
            hljs.highlightElement(preElement.querySelector('code'));
        });

        const actions = wrapper.querySelector('.message-actions');
        if (!actions) return;
        actions.innerHTML = ''; 

        const modelTag = document.createElement('span');
        modelTag.className = 'model-tag';
        modelTag.textContent = stats.model || selectedModel;
        actions.appendChild(modelTag);
        
        if (stats.time && stats.wps) {
            const wpsStat = document.createElement('span');
            wpsStat.className = 'generation-stat';
            wpsStat.textContent = `${stats.wps} w/s`;
            const timeStat = document.createElement('span');
            timeStat.className = 'generation-stat';
            timeStat.textContent = `(${stats.time.toFixed(1)}s)`;
            actions.appendChild(wpsStat);
            actions.appendChild(timeStat);
        }

        const copyFullBtn = document.createElement('button');
        copyFullBtn.className = 'action-btn';
        copyFullBtn.innerHTML = copyIconSVG;
        copyFullBtn.title = "Copy full response";
        copyFullBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(content).then(() => {
                copyFullBtn.innerHTML = checkIconSVG;
                setTimeout(() => { copyFullBtn.innerHTML = copyIconSVG; }, 2000);
            });
        });
        actions.appendChild(copyFullBtn);
        
        if (isLastMessage && chatHistory.length > 0) {
            const regenerateBtn = document.createElement('button');
            regenerateBtn.className = 'action-btn regenerate-btn';
            regenerateBtn.innerHTML = regenerateIconSVG;
            regenerateBtn.title = "Regenerate response";
            regenerateBtn.addEventListener('click', handleRegenerate);
            actions.appendChild(regenerateBtn);
        }
        
        if (htmlCode) {
            const previewBtn = document.createElement('button');
            previewBtn.className = 'preview-btn';
            previewBtn.textContent = 'Preview HTML';
            previewBtn.addEventListener('click', () => {
                const fullHtml = `
                    <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>HTML Preview</title><style>${cssCode}</style></head>
                    <body>${htmlCode}<script>${jsCode}<\/script></body></html>
                `;
                const previewWindow = window.open('', '_blank', 'width=800,height=600,resizable=yes,scrollbars=yes');
                previewWindow.document.write(fullHtml);
                previewWindow.document.close();
            });
            actions.appendChild(previewBtn);
        }
    }
    initialize();
});
