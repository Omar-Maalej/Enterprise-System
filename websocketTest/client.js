const socket = io('http://localhost:3000'); 

socket.on('connect', () => {
    console.log('Connected to WebSocket server!');
});

socket.on('new-message', message => {
    console.log('New message received:', message);
    addMessageToList(message);
});

socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server.');
});

function addMessageToList(message) {
    const messagesList = document.getElementById('messages');
    const newMessageItem = document.createElement('li');
    newMessageItem.textContent = `${message.user}: ${message.content}`;
    messagesList.appendChild(newMessageItem);
}

function sendMessage() {
    const user = document.getElementById('userInput').value.trim();
    const content = document.getElementById('messageInput').value.trim();

    if (!user || !content) {
        alert('Please enter both your name and a message.');
        return;
    }

    const message = { user, content };
    socket.emit('addMessage', message);
    document.getElementById('messageInput').value = '';
}

socket.emit(' ', {}, (messages) => {
    messages.forEach(addMessageToList);
});
