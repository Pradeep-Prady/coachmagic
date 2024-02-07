const http = require('http');
const socketio = require('socket.io');
const cors = require("cors");
const server = http.createServer();
const io = socketio(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

io.on('connection', (socket) => {
    // console.log('A user connected');

    socket.on('message', ({ groupId, message }) => {
        // console.log(`Received message: ${message} from group: ${groupId}`);
        io.to(groupId).emit('message', { message, isAdmin: true });
    });

    socket.on('joinGroup', ({ groupId }) => {
        socket.join(groupId);
        // console.log(`User joined group ${groupId}`);
    });

    socket.on('disconnect', () => {
        // console.log('User disconnected');
    });
});

const PORT = process.env.CHAT_PORT || 4000;

server.listen(PORT, () => {
    console.log(`Chat server running on port ${PORT}`);
});
