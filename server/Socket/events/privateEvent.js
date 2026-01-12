const { getUserBySocketId } = require("../helpers/userStore")

function privateEvent(io, socket) {

    // Private message event 
    socket.on('private:message', ({ to, message }) => {
        const sender = getUserBySocketId(socket.id)
        const receiver = getUserBySocketId(to)

        if (!sender || !to || !message) {
            return 
        }

        console.log(`💬 Private Messsage from ${sender.name} -> ${to}`)

        // Send to target user 
        io.to(to).emit('private:message', {
            from: sender.socketId, 
            to: to, 
            message, 
            time: Date.now()
        })

        // Send back the same message to the sender to store in chat history
        io.to(socket.id).emit('private:message', {
            from: sender.socketId, 
            to: to, 
            message, 
            time: Date.now()
        })
    })
}

module.exports = privateEvent