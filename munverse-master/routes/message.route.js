const chat = require('../controllers/message.controller')

module.exports = (app,io) => {

// chat.getchatroom()

//Io listeners
io.on('connect', (socket) => {
    chat.connected(socket)
    chat.load_messages(socket)

    socket.on('disconnect', (socket) => {
        chat.disconnected(socket)
    })

    socket.on('message', (data) => {
        chat.sendmessage(socket, data)
    })
})

}
