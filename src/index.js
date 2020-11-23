// Imports
const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
// const router = express.Router();

// Port
const port = process.env.PORT || 3000;

// Public directory path
const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
    console.log('New WebSocket Connection');

    // Welcome message for current connection
    socket.emit('message', 'Welcome!');

    // Message broadcast when user joins the room (boradcast for everyone except current user)
    socket.broadcast.emit('message', 'A new user has joined the room');

    // Send chat message
    socket.on('sendMessage', (message) => {
        // send message to everyone
        io.emit('message', message);
    });

    // Send Location Details
    socket.on('sendLocation', (location) => {
        io.emit(
            'message',
            `Location: https://google.com/maps?q=${location.latitude},${location.longitude}`
        );
    });

    // Disconnect Message
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left');
    });
});

// App started
server.listen(port, () => {
    console.log(`Server running on Port:${port}`);
});
