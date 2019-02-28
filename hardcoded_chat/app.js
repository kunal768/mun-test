const express = require('express')
const socket = require("socket.io")
const ejs = require("ejs")
const app = express()
const path = require('path')
const bodyParser = require("body-parser")

app.set("view engine","ejs")
app.use(express.static('public', {index: "main.html"}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))


// users
letters = ["a" , "b" , "c"]
var users = {}
//var current_user = user.username


const server = app.listen(3000,()=>{
  console.log("listening to port 3000")
})

var io = socket(server)

io.on('connect' , (socket) => {

  socket.emit("allusers",{
    users: users
  })

    console.log(socket.id)

    users[letters[0]] = socket.id

    socket.broadcast.emit("userconnected",{
      id : socket.id,
      name : letters[0]
    })

    letters.shift()

    console.log(users)
    console.log(letters)

    socket.on('disconnect' , () => {
               var name
               for(var i in users){
                if(users[i] == socket.id){
                      delete users[i]
                      name = i
                      }
                    }

        socket.broadcast.emit('userdisconnected', {
                 id: socket.id,
                 name: name
              })
           })



    socket.on("new message" , (data) => {
      socket.to(data.id).emit('newmessage', {
             message: data.message,
             name: "KUNAL" // get sender name from the front-end
         })
    })



})
