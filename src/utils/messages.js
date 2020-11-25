// Generate Message
const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime(),
    };
};

// Generate Location Message
const generateLocationMessage = (username, location) => {
    return {
        username,
        url: `https://google.com/maps?q=${location.latitude},${location.longitude}`,
        createdAt: new Date().getTime(),
    };
};

module.exports = { generateMessage, generateLocationMessage };
