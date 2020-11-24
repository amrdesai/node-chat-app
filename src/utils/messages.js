// Generate Message
const generateMessage = (text) => {
    return {
        text,
        createdAt: new Date().getTime(),
    };
};

// Generate Location Message
const generateLocationMessage = (location) => {
    return {
        url: `https://google.com/maps?q=${location.latitude},${location.longitude}`,
        createdAt: new Date().getTime(),
    };
};

module.exports = { generateMessage, generateLocationMessage };
