var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  //res.send('<h1>Hello world</h1>');
  res.sendFile('/Users/sriharshagaruda/Desktop/TwitterHackathon/index.html');
});

var clients=[];

io.on('connection',function(socket){
	console.log('1');
	clients.push(socket.id);
socket.on('chat message',function(msg){	
console.log('message:'+msg);
io.emit('chat message', msg);
});
console.log('a user connected');
console.log(clients);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
