const { addUser, getAllUsers, getUserBySocketId, removeUser } = require("../helpers/userStore");

function userEvents(io, socket) {
    // When user join the chat 
    socket.on('user:join', (name) => {
        if (!name) return;

        addUser(socket.id, name)

        console.log(`👤 User Joined: ${name} (${socket.id})`);

        // Send update to user list to everyone 
        io.emit('users:update', getAllUsers())
    })

    // Send online users list  
    socket.on('users:get', () => {
        socket.emit('users:update', getAllUsers())
    })

    // manuel leave event
    socket.on('user:leave', () => {
        const user = getUserBySocketId(socket.id)

        if (user) {
            removeUser(socket.id)
            console.log(`👋 User Left: ${user.name}`);

            io.emit('users:update', getAllUsers())
        }
    })

    // Auto disconnect 
    socket.on('disconnect', () => {
        const user = getUserBySocketId(socket.id)

        if (user) {
            removeUser(socket.id)
            console.log(`👋 User Left: ${user.username}`);

            io.emit('users:update', getAllUsers())
        }
    })
}

module.exports = userEvents