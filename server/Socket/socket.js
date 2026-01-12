const privateEvent = require("./events/privateEvent")
const userEvents = require("./events/userEvent")

function initializeSocket(io) {
    io.on('connection', (socket) => {
        console.log('User connected✅: ', socket.id)

        userEvents(io, socket) 
        privateEvent(io, socket)

        socket.on('disconnect', () => {
            console.log('User Disconnected', socket.id)
        })
    })
}

module.exports = initializeSocket