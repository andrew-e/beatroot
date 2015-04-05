var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var size = 16;
var drumState = new Array(size);
for (var i = 0; i < size; i++)
  drumState[i] = new Array(size);

for (var i = 0; i < size; i++) {
  for (var j = 0; j < size; j++){
    drumState[i][j] = false;
  }
}

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
    drumState[~~(pos/size)][pos%size] = !drumState[~~(pos/size)][pos%size];
    console.log('broadcasting new drum state');
    var flat = drumState.reduce(function(a, b){
      return a.concat(b);
    });
    var s = 'Active drums: ';
    flat.forEach(function(cur, i){
      if (cur) s += ' ' + i;
    });
    console.log(s);
    io.sockets.emit('setDrumState', drumState);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
