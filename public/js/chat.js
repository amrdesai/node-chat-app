const socket = io();

socket.on('message', (message) => {
    console.log(message);
});

const messageForm = document.getElementById('message-form');

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const messageInput = e.target.elements.message;

    // If message input is empty then do nothing
    if (!messageInput) {
        return;
    }

    // Else send msg to server
    socket.emit('sendMessage', messageInput.value);

    // Clear input
    messageInput.value = '';
});
