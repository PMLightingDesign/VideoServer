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
    "debug": true,
    "socket": currentSock,
    "audio_only": false,
    "time_update": 1
}, [
  "--idle",
  "--fullscreen"
]);

//mpv.command("loadfile",["C:/Users/Public/Music/Sample Music/Kalimba.mp3"]);

mpv.loadFile('https://soundcloud.com/testshotstarfish/sets/music-for-space-2', mode="replace");

let report = {};
function reportInfo(data){
  if(data.status){
    for(key in data.status){
      report[key] = data.status[key];
    }
  }
  if(data.time){
    report.time = data.time;
  }
  console.log(util.inspect(report));
}

mpv.on('statuschange', function(info){
  reportInfo({
    status: info
  });
});

mpv.on('timeposition', function(info){
  reportInfo({
    time: info
  });
});
