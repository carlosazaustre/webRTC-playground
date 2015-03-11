// -- Dependencies -------------------------------------------------------------

var express = require('express');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var app = express();
var server = require('http').Server(app);
var webRTC = require('webrtc.io').listen(server);
var io = require('socket.io')(server);

// -- Config -------------------------------------------------------------------

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('hbs', expressHbs({ extname: 'hbs', defaultLayout: 'default' }));
app.set('view engine', 'hbs');
app.use('/static', express.static(__dirname + '/public'));

// -- Routes -------------------------------------------------------------------

app.get('/', function(req, res) {
  res.render('home');
});

// -- Event Sockets ------------------------------------------------------------

io.on('connection', function(socket) {
  console.log('A user connected');

  socket.on('chat message', function(msg) {
    console.log("Message: " + msg);
  });

  socket.on('disconnet', function() {
    console.log('User disconnected')
  });
});

// -- Start --------------------------------------------------------------------

server.listen(3000, function(){
  console.log('listening on *:3000');
});
