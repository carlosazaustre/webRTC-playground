var suma = require('./suma');

// -- Variables ----------------------------------------------------------------

var videos = [];
var PeerConnection = window.PeerConnection ||
                     window.webkitPeerConnection00 ||
                     window.webkitRTCPeerConnection ||
                     window.mozRTCPeerConnection ||
                     window.RTCPeerConnection;

// -- Cached DOM elements
var localVideo = document.querySelector('[data-video="local"]');
var remoteVideo = document.querySelector('[data-video="remote"]');
var browserURL = window.location;
var streamOpts = {
  "video": { "mandatory": {}, "optional": [] },
  "audio": true
};

// -- OnLoad function ----------------------------------------------------------

(function () {

  console.log(suma(1,2));

  if(PeerConnection) {
    rtc.createStream(streamOpts, function(stream) {
      localVideo.src = URL.createObjectURL(stream);
      localVideo.play();
    });

  } else {
    alert("Tu navegador no soporta WebRTC :(");
  }

  var room = browserURL.hash.slice(1);

  rtc.connect("ws:" + browserURL.href.substring(browserURL.protocol.length).split('#')[0], room);

  rtc.on('add remote stream', function(stream, socketId) {
    console.log('>>> Adding Remote Stream...')
    //var video = document.getElementById('remoteVideo');
    remoteVideo.id = "remote" + socketId;
    videos.push(remoteVideo);
    document.getElementById(remoteVideo.id).setAttribute("class", "");
    rtc.attachStream(stream, remoteVideo.id);
  });

  rtc.on('disconnect stream', function(data) {
    console.log('>>> Remove ' + data);
    removeVideo(data);
  });

})();

// -- Hang Up the stream -------------------------------------------------------
function removeVideo(socketId) {
  var videoToRemove = document.getElementById('remote' + socketId);
  if(video) {
    videos.splice(videos.indexOf(videoToRemove), 1);
    videoToRemove.parentNode.removeChild(videoToRemove);
  }
}