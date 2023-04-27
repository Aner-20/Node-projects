const io = require('socket.io')(3000, {
    cors: {
        origin: '*',
    }
})

const users = {}


io.on('connection', socket => {
    console.log("Game");
    socket.emit('chat-message', "Joined")


    socket.on('send-info', info => {
        socket.broadcast.emit('info', {info: info})
    })

    socket.on('new-user', name => {
        users[socket.id] = name;
        console.log(usersJo)
        socket.broadcast.emit('user-connected', name);
    })

})