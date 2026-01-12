let users = [] // Format: {socketId, name}

function addUser(socketId, name) {
    const userExist = users.some(
        (item) => item.name === name || item.socketId === socketId
    )

    if (userExist) return;

    users.push({ socketId, name })
}

function removeUser(socketId, name) {
    users = users.filter((item) => item.socketId !== socketId)
}

function getUserBySocketId(socketId) {
    return users.find(item => item.socketId === socketId)
}

function getAllUsers() {
    return users
}

module.exports = {
    addUser, 
    removeUser, 
    getUserBySocketId, 
    getAllUsers
}