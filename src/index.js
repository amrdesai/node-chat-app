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

    socket.emit('message', 'Welcome!');

    socket.on('sendMessage', (message) => {
        io.emit('message', message);
    });
});

// App started
server.listen(port, () => {
    console.log(`Server running on Port:${port}`);
});
