const socket = io();

// Elements
const messageFormEl = document.getElementById('message-form');
const messageInputEl = document.getElementById('message-input');
const messageFormSendBtn = document.getElementById('message-send-btn');
const sendLocationBtn = document.getElementById('send-location-btn');
const messagesDiv = document.getElementById('messages');

// Templates
const messageTemplate = document.getElementById('message-template').innerHTML;
const locationMessageTemplate = document.getElementById(
    'location-message-template'
).innerHTML;

// Send message in chat
socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm A'),
    });
    messagesDiv.insertAdjacentHTML('beforeend', html);
});

// Send location in chat
socket.on('locationMessage', (location) => {
    console.log(location);
    const html = Mustache.render(locationMessageTemplate, {
        location: location.url,
        createdAt: moment(location.createdAt).format('h:mm A'),
    });
    messagesDiv.insertAdjacentHTML('beforeend', html);
});

// Event Listener: Message element
messageFormEl.addEventListener('submit', (e) => {
    e.preventDefault();
    // Run only if input isn't empty
    if (messageInputEl.value !== '') {
        // Disable send buton while processing
        messageFormSendBtn.disabled = true;
        // Send message to server
        socket.emit('sendMessage', messageInputEl.value, (error) => {
            // Enable send button
            messageFormSendBtn.disabled = false;
            // Clear input
            messageInputEl.value = '';
            messageInputEl.focus();
            // Check if there's an error
            if (error) {
                return console.log(error);
            }
            console.log('Message delivered!');
        });
    }
});

// Event Listener: Send location
sendLocationBtn.addEventListener('click', () => {
    // If browser doesn't support Geolocation
    if (!navigator.geolocation) {
        return alert(`Sorry, Geolocation feature isn't by your browser!`);
    }
    // Disable location button spamming
    sendLocationBtn.disabled = true;
    // Get location
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit(
            'sendLocation',
            {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            },
            () => {
                // Client side acknowledgment
                // console.log('Location shared!');
                sendLocationBtn.disabled = false;
            }
        );
    });
});
