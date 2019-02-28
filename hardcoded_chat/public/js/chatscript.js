var output = document.getElementById('inbox')
var msg = io.connect("localhost:3000")
var btn = document.getElementById('send')
var to = document.getElementById('receiver')
var message = document.getElementById("send_message")

var users = {}

msg.on("userconnected",(data) => {
  users[data.name] = data.id
})

msg.on('userdisconnected', (data) => {
  // delete from front end active user list

	delete users[data.name]
})


// session id se user message
btn.onclick = () => {
  console.log(users)
  // dear UI Person please ...
  // add name : (i know u have something to display the username).value
  msg.emit("new message" , {id : users[to.value]  , message : message.value })
}

msg.on("newmessage" , (data) => {
   output.innerHTML += "<p>" + data.name + " says " + data.message  +"</p>"
   console.log("<p>" + data.name + " says " + data.message)
})

msg.on('allusers', (data) => {
	_.each(data.users, (id, name) => {
		//addUser(id, name)
    users[name] = id
	})
})
