const cp = require('child_process');

function vlcPlayFile(filename, respHook){
  let msg = "";

  vlc = cp.spawn('cvlc', ['-f', '--intf', 'rc', filename]);

  vlc.stdout.on('data', function(data){
    vlc.vsDataHook = parse(data);
    console.log('stdout: ' + data);
  });

  vlc.stderr.on('data', function(data){
    console.log('stdout: ' + data);
  });

  vlc.on('close', function(code){
    console.log('stdout: ' + code);
  });

  return vlc;
}

function generic(payload){
  return {
    paload: payload,
    type: 'generic'
  }
}

function parse(data){
  let msg = data.toString().split('\r\n');
  if(!isNaN(parseInt(msg[0]))){
  console.log(parseInt(msg[0]));
    msg = {
      pos: msg[0],
      end: msg[1],
      file: msg[2],
      type: "playbackInfo"
    }
  } else {
    msg = generic(msg);
  }
  return msg;
}



module.exports.vlcPlayFile = vlcPlayFile;
