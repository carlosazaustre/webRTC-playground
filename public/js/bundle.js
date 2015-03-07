(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./suma":2}],2:[function(require,module,exports){
var suma = function(a, b) {
  return a + b;
}

module.exports = suma;

},{}]},{},[1]);
