var videos = [];
var PeerConnection = window.PeerConnection ||
                     window.webkitPeerConnection00 ||
                     window.webkitRTCPeerConnection ||
                     window.mozRTCPeerConnection ||
                     window.RTCPeerConnection;

function init() {
  if(PeerConnection) {
    rtc.createStream({
      "video": { "mandatory": {}, "optional": [] },
      "audio": true
    }, function(stream) {
      document.getElementById('you').src = URL.createObjectURL(stream);
      document.getElementById('you').play();
    });
  }
  else {
    alert("Your browser is not supported or you have turn on flags");
  }

  var room = window.location.hash.slice(1);

  rtc.connect("ws:" + window.location.href.substring(window.location.protocol.length).split('#')[0], room)

  rtc.on('add remote stream', function(stream, socketId) {
    console.log('Adding Remoe Stream...');
    var clone = cloneVideo('you', socketId);
    document.getElementById(clone.id).setAttribute("class", "");
    rtc.attachStream(stream, clone.id);
    subdivideVideos();
  });

  rtc.on('disconnect stream', function(data) {
    console.log('Remove ' + data);
    removeVideo(data);
  });

  initFullScreen();
  initNewRoom();
}


function initFullScreen() {}

function initNewRoom() {}


function cloneVideo(domId, socketId) {
  var video = document.getElementById(domId);
  var clone = video.cloneNode(false);
  clone.id = "remote" + socketId;
  document.getElementById('videos').appendChild(clone);
  videos.push(clone);
  return clone;
}

function subdivideVideos() {
  var perRow = getNumPerRow();
  var numInRow = 0;
  for(var i=0, len=videos.length; i<len; i++) {
    var video = videos[i];
    setWH(video, i);
    numInRow = (numInRow + 1) % perRow;
  }
}

function setWH(video, i) {
  var perRow = getNumPerRow();
  var perColumn = Math.ceil(videos.length / perRow);
  var width = Math.floor((window.innerWidth) / perRow);
  var height = Math.floor((window.innerHeight - 190) / perColumn);
  video.width = width;
  video.height = height;
  video.style.position = 'absolute';
  video.style.left = (i % perRow) * width + "px";
  video.style.top = Math.floor(i / perRow) * height + "px";
}

function getNumPerRow() {
  var len = videos.length;;;;;;
  var biggest;

  if(len % 2 === 1) {
    len++;
  }

  biggest = Math.ceil(Math.sqrt(len));
  while(len % biggest !== 0) {
    biggest++;
  }
  return biggest;
}
