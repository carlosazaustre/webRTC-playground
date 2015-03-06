// -- Dependencies -------------------------------------------------------------

var express = require('express');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var app = express();
var server = require('http').createServer(app);
var webRTC = require('webrtc.io').listen(server);

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

webRTC.rtc.on('chat_msg', function(data, socket) {
  var roomList = webRTC.rtc.rooms[data.room] || [];

  for(var i=0; i, roomList.length; i++) {
    var socketId = roomList[i];

    if(socketId !== socket.id) {
      var soc = webRTC.rtc.getSockect(socketId);

      if(soc) {
        soc.send(JSON.stringify({
          "eventName": 'receive_chat_msg',
          "data": {
            "messages": data.messages,
            "color": data.color
          }
        }), function(error) {
          if(error) {
            console.log(error);
          }
        });
      }
    }
  }

});

// -- Start --------------------------------------------------------------------

server.listen(3000, function(){
  console.log('listening on *:3000');
});
