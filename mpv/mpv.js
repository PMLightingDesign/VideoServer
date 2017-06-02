const MPV = require('node-mpv');
const util = require('util');
const os = require('os');

const linuxSock = "/tmp/node-mpv.sock"
const winSock = "\\\\.\\pipe\\mpvsocket"
let currentSock = "";

if(os.type() == 'Windows_NT'){
  currentSock = winSock;
} else if (os.type() == 'Linux'){
  currentSock = linuxSock;
}



let mpv = new MPV({
    "verbose": false,
    "debug": false,
    "socket": currentSock,
    "audio_only": false,
    "time_update": 1
}, [
  "--idle"
]);

mpv.observeProperty("playback-time", 13);

mpv.command("loadfile",["/home/saabstory88/VideoServer/audio/Black Vortex.mp3"]);

mpv.on('statuschange', function(info){
  console.log('GOT: ' + util.inspect(info));
});

setTimeout(function(){
  mpv.freeCommand(JSON.stringify({ "command": ["stop"] }));
  console.log("Tried Command")
}, 5000);
