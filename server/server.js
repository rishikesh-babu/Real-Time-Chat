const express = require('express');
const app = express() 
const http = require('http')
const dotenv = require('dotenv')
const cors = require('cors')

app.use(cors())
dotenv.config()

const { Server } = require('socket.io');
const initializeSocket = require('./Socket/socket');
const  server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: process.env.BASE_URL, 
        methods: ["GET", "POST"]
    }
})

initializeSocket(io)

server.listen(process.env.PORT, (err) => {
    if (err) {
        console.log('Error in starting server')
        console.log('err :>> ', err);
    } else {
        console.log(`Server is running at port: ${process.env.PORT}`)
    }
})