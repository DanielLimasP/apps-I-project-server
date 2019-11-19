//Como siempre, empezamos definiendo express y tal
const express = require('express'),
http = require('http'),
app = express(),
server = http.createServer(app),
io = require('socket.io').listen(server);

app.get('/', (req, res) => {
  res.send('El servidor está escuchando en el puerto 3000')
});
  io.on('connection', (socket) => {
    console.log('Usuario conectado')
    //Función socket.on "join" que detecta cuando se conecté un nuevo usuario
    socket.on('join', function(userNickname) {
        var  message = {"message": 'El usuario '+userNickname+' se ha unido al chat', "senderNickname": 'Server'}
        console.log(userNickname+": Se ha unido al chat");
        socket.broadcast.emit('userjoinedthechat', message);
        //socket.broadcast.emit('userjoinedthechat', userNickname +" : Se ha unido al chat");
    });
    //Función socket.on "messagedetection" que detecta cuando un usuario
    socket.on('messagedetection', (senderNickname,messageContent) => {
       //Mostramos el mensaje en la consola
       console.log(senderNickname+": " +messageContent)
       //Creamos un objeto "mensaje"
       var  message = {"message": messageContent, "senderNickname": senderNickname}
       //Y emitimos el mensaje al cliente
       io.emit('message', message );
    });
    //Función socket.on "disconnect" que detecta cuando un usuario se desconecta
     socket.on('disconnect', function() {
        console.log('Un usuario se ha desconectado')
        socket.broadcast.emit("userdisconnect"," El usuario se ha desconectado ")
    });
});
server.listen(3000,()=>{
console.log('El servidor está escuchando en el puerto 3000');
});
