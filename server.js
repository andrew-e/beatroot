var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var size = 16;
var drumState = new Array(size*size);
for (var i = 0; i < size*size; i++)
  drumState[i] = false; 

app.use(express.static('dist'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/dist/index.html');
});

io.on('connection', function(socket){
  console.log('connected');
  socket.on('getDrumState', function(){
    console.log('in getDrumState');
    socket.emit('setDrumState', drumState);
  });
  socket.on('toggle', function(pos){
    drumState[pos] = !drumState[pos];
    console.log('broadcasting new drum state');
    var s = 'Active drums: ';
    drumState.forEach(function(cur, i){
      if (cur) s += ' ' + i;
    });
    console.log(s);
    io.sockets.emit('setDrumState', drumState);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
