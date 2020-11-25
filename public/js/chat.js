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
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

// Auto-scroll function
const autoscroll = () => {
    // New message element
    const newMessageEl = messagesDiv.lastElementChild;

    // Height of the new message
    const newMessageStyles = getComputedStyle(newMessageEl);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = newMessageEl.offsetHeight + newMessageMargin;

    // Visible height
    const visibleHeight = messagesDiv.offsetHeight;

    // Height of messages container
    const containerHeight = messagesDiv.scrollHeight;

    // How far have I scrolled?
    const scrollOffset = messagesDiv.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
};

// Send message in chat
socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm A'),
    });
    messagesDiv.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

// Send location in chat
socket.on('locationMessage', (location) => {
    const html = Mustache.render(locationMessageTemplate, {
        username: location.username,
        location: location.url,
        createdAt: moment(location.createdAt).format('h:mm A'),
    });
    messagesDiv.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

//
socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, { room, users });
    const sidebarEl = document.getElementById('sidebar');
    sidebarEl.innerHTML = html;
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

// Join a chat room
socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
});
