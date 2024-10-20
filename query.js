document.addEventListener('DOMContentLoaded', () => {
    const sendMessageButton = document.getElementById('send-message');
    const messageInput = document.getElementById('message');
    const chatBox = document.getElementById('chat-box');
    const chatHistory = document.getElementById('chat-history');
    const newChatButton = document.getElementById('new-chat');
    let chatSessions = [];
    let currentSession = [];

    // Function to send a message
    function sendMessage() {
        const messageText = messageInput.value.trim();
        if (messageText !== '') {
            appendMessage('user', messageText);
            messageInput.value = '';

            // Send message to the backend (Flask)
            fetch('/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        'message': messageText
                    })
                })
                .then(response => response.json())
                .then(data => {
                    // Append the bot response
                    appendMessage('bot', data.response);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }

    // Function to append a message
    function appendMessage(sender, messageText) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = messageText;

        const timestamp = document.createElement('div');
        timestamp.classList.add('timestamp');
        timestamp.textContent = new Date().toLocaleTimeString();

        messageElement.appendChild(messageContent);
        messageElement.appendChild(timestamp);
        chatBox.appendChild(messageElement);

        // Scroll to the bottom
        chatBox.scrollTop = chatBox.scrollHeight;

        // Store messages in the current session
        currentSession.push({
            sender: sender,
            message: messageText,
            time: timestamp.textContent
        });
    }

    // Event listener for the "Send Message" button
    sendMessageButton.addEventListener('click', sendMessage);

    // Allow Enter key to send message
    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });

    // Function to start a new chat
    newChatButton.addEventListener('click', () => {
        if (currentSession.length > 0) {
            chatSessions.push(currentSession);
            currentSession = [];
        }
        chatBox.innerHTML = ''; // Clear chat box for new conversation
    });
});