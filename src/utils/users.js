const users = [];

// Add user
const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // validate the data
    if (username === '' || room === '') {
        return {
            error: 'Username and room is required!',
        };
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username;
    });

    // validate username
    if (existingUser) {
        return {
            error: 'Username is in use!',
        };
    }

    // Store user
    const newUser = { id, username, room };
    users.push(newUser);

    return {
        newUser,
    };
};

// Remove user
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1);
    }
};

// getUser
const getUser = (id) => {
    return users.find((user) => user.id === id);
};

// getUsersInRoom
const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room);
};