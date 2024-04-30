const userId = localStorage.getItem('userId');

const socket = io('http://localhost:3000', {
    query: {
        userId
    }
});

document.getElementById('messageForm').addEventListener('submit', function(event) {
    event.preventDefault();
    sendMessage();
});

socket.on('connect', () => {
    console.log('Connected to WebSocket server!');
    // requestInitialMessages();
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

    newMessageItem.innerHTML = `
        <div class="message">
            <div class="message-user">
                <span>${message.sender.username}</span>
                ${message.sender.id == userId ? '<span class="message-user-you">(You)</span>' : ''}
            </div>
            <div class="message-content">
                <span>${message.messageContent}</span>
            </div>
            <div class="message-date">
                <span>${new Date(message.createdAt).toLocaleString()}</span>
            </div>
        </div>
    `;
    messagesList.appendChild(newMessageItem);

}

function sendMessage() {
    // const senderId = document.getElementById('userInput').value.trim();
    const messageContent = document.getElementById('messageInput').value.trim();

    if (userId && messageContent) {
        const message = { senderId: userId, messageContent, receiverId: 
            localStorage.getItem('userId') == '1' ? '2' : '1'
        };
        socket.emit('addMessage', message);
        document.getElementById('messageInput').value = '';
    } else {
        alert('Please enter both your name and a message.');
    }
}

// function requestInitialMessages() {
//     socket.emit('getAllMessages', {}, (messages) => {
//         messages.forEach(addMessageToList);
//     });
// }

axios.get('http://localhost:3000/messages', {
    params: {
        senderId: localStorage.getItem('userId'),
        receiverId: localStorage.getItem('userId') == '1' ? '2' : '1',
        isRoom: false
    }
}).then(response => {
    console.log("response", response.data);
    response.data.forEach(addMessageToList);
    
}).catch(error => {
    console.log(error);
});