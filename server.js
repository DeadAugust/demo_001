
var atmans = [];

function Atman(id, x, y, fud, r, g, b){
  this.id = id;
  this.x = x;
  this.y = y;
  this.fud = fud;
  this.r = r;
  this.g = g;
  this.b = b;
}

var express = require('express');
var app = express();
// var server = app.listen(3000);

var server = app.listen(process.env.PORT || 3000, listen);

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

console.log('My socket server is running');
// var socket = require('socket.io');
// var io = socket(server);

var io = require('socket.io')(server);

setInterval(heartbeat, 33);

function heartbeat(){
  io.sockets.emit('heartbeat', atmans);
}

io.sockets.on('connection',
  function(socket){
    console.log("We have a new client: " + socket.id);
    socket.on('start',
      function(data){
        console.log(socket.id + " " + data.fud);
        var atman = new Atman(socket.id, data.x, data.y, data.fud);
        atmans.push(atman);
      }
    );

    socket.on('update',
      function(data) {
        var atman;
        for (var i = 0; i < atmans.length; i++){
          if (socket.id == atmans[i].id){
            atman = atmans[i];
          }
        }
        // atman.id = socket.id; //why
        atman.x = data.x;
        atman.y = data.y;
        atman.fud = data.fud;
        atman.r = data.r;
        atman.g = data.g;
        atman.b = data.b;
      }
    );

    socket.on('get',
      function(data){
        socket.broadcast.emit('get', data);
        // io.sockets.emit('get', data);
        // socket.broadcast.to(data.id).emit('get', data);
        // io.to(`${data.id}`).emit('get',data);
        console.log(data);
      }
    );

    socket.on('disconnect',
      function(data){ //how to remove old players???
        // for (var i = atmans.length -1; i >= 0; i--){
        //   if(socket.id == atmans[i].id){
        //     atmans = atmans.slice(atmans[i]);
        //   }
        // }
        console.log("Client has disconnected");
        console.log(atmans);
      }
    );
  }
);
/*
function newConnection(socket) {
  console.log('new connection: ' + socket.id);

  socket.on('mouse', mouseMsg);

  function mouseMsg(data){
    socket.broadcast.emit('mouse', data);
    console.log(data);
  }
}
*/
