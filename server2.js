//Crearemos un arreglo con todos los bolas que entren al servers
var balls = [];
function Ball(nickname, x, y, r){
  this.x = x;
  this.y = y;
  this.nickname = nickname;
  this.r = r;
}
// --------------> Aquí empieza el código funcional
//Uso de la librería Express para crear el server en LH:3000 con entry point 'public'
var server = ExpressObject(3010, 'express', 'public');
//Uso de los websockets para algo
var sock = new SocketObject('socket.io', server);
sock.listening();
sock.setInter();
// --------------> Aquí se termina

// Función para crear el server
function ExpressObject(port, environment, folder){
  var express = require(environment); //environment = express, folder = public
  var app = express(); // Express Mumbo Jumbo para crear el server
  var server = app.listen(port); // Creación de un servidor local en el puerto 3000
  app.use(express.static(folder)); //Uso de los recursos en la carpeta public
  console.log("---> Socket server running at localhost: "+port+ " <---"); //Simple console.log
  return server;
}
// Función o clase o constructor o lo que sea que crea el objeto SocketObject (o websockets)
function SocketObject(env, server){
  this.env = env;
  this.server = server;
  var socket = require(this.env);//'socket.io'
  var io = socket(this.server);//server
  // -------------------------> Funciones del socket
  this.heartbeat = function(){
    io.sockets.emit('heartbeat', balls);
  }
  this.setInter = function(){
    setInterval(this.heartbeat, 15);
  }
  this.listening = function(){
    //En teoría, el objeto de la clase SocketObj que llame a esta función, estará escuchando
    //los diferentes mensajes mientras dure la conexión
    //Conexión al websocket
    //Al conectarse un nuevo cliente, se ejecutará la función anónima que manejará
    //todos los eventos en el servidor.
    io.on('connection', (socket) => {
      console.log('Usuario conectado')
      //Función socket.on "join" que detecta cuando se conecté un nuevo usuario
      socket.on('join', function(userNickname) {
          var  message = {"message": 'El usuario '+userNickname+' se ha unido al chat', "senderNickname": '🔴 Server'}
          console.log(userNickname+": Se ha unido al chat " +socket.id);
          socket.broadcast.emit('userjoinedthechat', message);
          //socket.broadcast.emit('userjoinedthechat', userNickname +" : Se ha unido al chat");
      });

      socket.on('newBall', (ballData) => {
        console.log("newBall");
        console.log(ballData);
        var ball = new Ball(ballData.nickname, ballData.x, ballData.y, ballData.r);
        balls.push(ball);
        }
      );
      socket.on('update', (ballData) => {
        console.log("update");
        console.log(ballData);
            var ball;
              for(var i = 0; i < balls.length; i++){
                if(socket.id == balls[i].id){
                  ball = balls[i];
                  ball.x = ballData.x;
                  ball.y = ballData.y;
                  ball.r = ballData.r;
                }
              }

            }

          );

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
  }
}
