// -- Variables ----------------------------------------------------------------

var videos = [];
var PeerConnection = window.PeerConnection ||
                     window.webkitPeerConnection00 ||
                     window.webkitRTCPeerConnection ||
                     window.mozRTCPeerConnection ||
                     window.RTCPeerConnection;

// -- Cached DOM elements
var localVideo = document.getElementById('localVideo');
var remoteVideo = document.getElementById('remoteVideo');
var browserURL = window.location;
var streamOpts = {
  "video": { "mandatory": {}, "optional": [] },
  "audio": true
};

// -- OnLoad function ----------------------------------------------------------

(function () {

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
    var video = document.getElementById('remoteVideo');
    video.id = "remote" + socketId;
    videos.push(video);
    document.getElementById(video.id).setAttribute("class", "");
    rtc.attachStream(stream, video.id);
  });

  rtc.on('disconnect stream', function(data) {
    console.log('>>> Remove ' + data);
    removeVideo(data);
  });

})();

// -- Hang Up the stream -------------------------------------------------------
function removeVideo(socketId) {
  var video = document.getElementById('remote' + socketId);
  if(video) {
    videos.splice(videos.indexOf(video), 1);
    video.parentNode.removeChild(video);
  }
}
