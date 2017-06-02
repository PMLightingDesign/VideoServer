const MPV = require('node-mpv');
const util = require('util');
const os = require('os');

const linuxSock = "/tmp/nodempv.sock";
const winSock = "\\\\.\\pipe\\mpvsocket";

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
  "--idle",
  "--fullscreen"
]);

mpv.observeProperty('playlist', 13);

let report = {};

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

process.on('message', (m) => {
  console.log(m);
  mpv.freeCommand(m);
});

function reportInfo(data){
  if(data.status){
    for(key in data.status){
      report[key] = data.status[key];
    }
  }
  if(data.time){
    report.time = data.time;
  }
  process.send(report);
}
