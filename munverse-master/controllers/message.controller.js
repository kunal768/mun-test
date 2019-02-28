var _  = require('lodash')
const Message = require('../models/message.model')
const User = require('../models/user.model')
const logger = require('../utils/logger')

// required
exports.getchatroom = (req,res) => {
    // global variable
    user_name = user.username
    res.render("../public/main.html")
}

// load users
var users = {} // User -> id pairs


exports.connected = (socket) =>{
    socket.emit("allusers",{
        users: users
    })
    users[user_name] = socket.id
    socket.broadcast.emit("userconnected",{
        id : socket.id,
        name : user_name
    })
    //console.log(users)
}

exports.disconnected = (socket) =>{
  delete users[user_name]
	socket.broadcast.emit('userdisconnected', {
        id: socket.id,
        name: user_name
    })
}

exports.sendmessage = (socket,data) => {

  var new_message = new Message({
    sender : User.findOne({'name':user_name}),
    receiver : User.findOne({'name':users[data.id]}),
    ViaEb : data.via_eb,
    content : data.message,
  })

  new_message.save((err) => {logger.error(err)})

	socket.to(data.id).emit('newmessage', {
        message: new_message.content,
        name: user_name
    })

  if(data.via_eb == true){
    User.find({'user_type' : 1} , (err , eb_list) => {

      for(var user in eb_list){
        socket.to(users[user.username]).emit('message_viaEb', {
          message : new_message.content,
          sender : new_message.sender.username,
          receiver : new_message.receiver.username,
        })
      }

    })
  }

}

exports.load_messages = (socket) => {
  Message.find({'receiver' : user_name} , (err , message_list) => {
    socket.emit("load_messages",message_list)
  })
}
