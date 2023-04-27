const io = require('socket.io')(3000, {
    cors: {   // fixes a problem related to CORS
        origin: "*",
    }
}); // creates a server on Port 3000

const users = {}

// Every time a user loads his website 
io.on('connection', socket => {   // socket sends a message to the user
    //console.log("New User")   // two since there are two windows opened
    socket.emit('chat-message', "Hello World")   // (, data)
    
    socket.on('new-user', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name)
    })
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', {message: message, name: users[socket.id]})  // sends a message to everyone except to the sender
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id]
    })

})
