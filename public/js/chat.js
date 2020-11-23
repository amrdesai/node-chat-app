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

// Send location
const sendLocationBtn = document.getElementById('send-location');
sendLocationBtn.addEventListener('click', () => {
    // If browser doesn't support Geolocation
    if (!navigator.geolocation) {
        return alert(`Sorry, Geolocation feature isn't by your browser!`);
    }

    // Get location
    navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position);
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        });
    });
});
