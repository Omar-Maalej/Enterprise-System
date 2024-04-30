const socket = io('http://localhost:3000');

document.getElementById('messageForm').addEventListener('submit', function(event) {
    event.preventDefault();
    sendMessage();
});

socket.on('connect', () => {
    console.log('Connected to WebSocket server!');
    requestInitialMessages();
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

    if (user && content) {
        const message = { user, content };
        socket.emit('addMessage', message);
        document.getElementById('messageInput').value = '';
    } else {
        alert('Please enter both your name and a message.');
    }
}

function requestInitialMessages() {
    socket.emit('getAllMessages', {}, (messages) => {
        messages.forEach(addMessageToList);
    });
}
