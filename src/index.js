// Imports
const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {
    generateMessage,
    generateLocationMessage,
} = require('./utils/messages');
const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
} = require('./utils/users');

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

    // Join cht room
    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options });

        if (error) {
            return callback(error);
        }

        socket.join(user.room);

        // Send welcome message for current client connection
        socket.emit('message', generateMessage(`Welcome, ${user.username}`));

        // Message broadcast when user joins the room (boradcast for everyone except current user)
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                generateMessage(`${user.username} has joined the room.`)
            );

        callback();
    });

    // Send chat message
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!');
        }

        // Send user's message to all connected users
        io.to('cat').emit('message', generateMessage(message));

        // Server side acknowledgment
        callback();
    });

    // Send Location Details
    socket.on('sendLocation', (location, callback) => {
        io.emit('locationMessage', generateLocationMessage(location));

        // Server side acknowledgment
        callback();
    });

    // Message when someone disconnects the chatroom
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit(
                'message',
                generateMessage(`${user.username} left the chat!`)
            );
        }
    });
});

// App started
server.listen(port, () => {
    console.log(`Server running on Port:${port}`);
});
