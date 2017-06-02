const os = require('os');

const videoPath = '/home/saabstory88/VideoServer/video';
const audioPath = '/home/saabstory88/VideoServer/audio';
const thumbPath = '/home/saabstory88/VideoServer/public/img/thumbs';
const linuxSock = "/tmp/nodempv.sock";
const winSock = "\\\\.\\pipe\\mpvsocket";

let currentSock = "";

if(os.type() == 'Windows_NT'){
  currentSock = winSock;
} else if (os.type() == 'Linux'){
  currentSock = linuxSock;
}

let mpvOpts = {
    "verbose": false,
    "debug": true,
    "socket": currentSock,
    "audio_only": false,
    "time_update": 1
};
let mpvFlags = new Array([
  "--idle",
  "--fullscreen"
]);

let globals = {
  mpvFlags: mpvFlags,
  mpvOpts: mpvOpts,
  video: videoPath,
  audio: audioPath,
  thumbs: thumbPath,
  sock: currentSock,
  presetMovie: 'none'
}

module.exports = globals;
