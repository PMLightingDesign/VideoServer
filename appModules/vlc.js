const cp = require('child_process');
const globals = require('./globals.js');
const fs = require('fs');

function vlcPlayFile(filename, loop){
  let msg = "";

  if(loop == true || loop == "true"){
    console.log("Entering Loop Mode")
    vlc = cp.spawn('cvlc', ['-f', '--intf', 'rc', '--no-video-title-show', "--loop", filename]);
  } else {
    console.log("Entering Normal Mode")
    vlc = cp.spawn('cvlc', ['-f', '--intf', 'rc', '--no-video-title-show', filename]);
  }

  vlc.stdout.on('data', function(data){
    vlc.vsDataHook = parse(data);
    //console.log('stdout: ' + data);
  });

  vlc.stderr.on('data', function(data){
    console.log('stdout: ' + data);
  });

  vlc.on('close', function(code){
    //console.log('stdout: ' + code);
  });

  return vlc;
}

function vlcPlaylist(filename, loop){
  let msg = "";

  if(loop == true || loop == "true"){
    console.log("Entering Loop Mode")
    vlc = cp.spawn('cvlc', ['-f', '--intf', 'rc', '--no-video-title-show', "--loop", filename]);
  } else {
    console.log("Entering Normal Mode")
    vlc = cp.spawn('cvlc', ['-f', '--intf', 'rc', '--no-video-title-show', filename]);
  }

  vlc.stdout.on('data', function(data){
    vlc.vsDataHook = parse(data);
    //console.log('stdout: ' + data);
  });

  vlc.stderr.on('data', function(data){
    console.log('stdout: ' + data);
  });

  vlc.on('close', function(code){
    //console.log('stdout: ' + code);
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
  //console.log(parseInt(msg[0]));
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

function makeThumbnails(files){
  for(let i = 0; i < files.length; i++){
    // /ffmpeg -i $uploaded_file -ss 00:00:01.000 -vframes 1 output.png
    let currentFile = globals.video + '/' + files[i].base;
    let outputImage = globals.thumbs + '/' + files[i].name + '.png';
    fs.stat(outputImage, function(err, data) {
       if (err){
         console.log('Making new Thumbnail');
         files[i].proc = cp.spawn('ffmpeg', ['-i', currentFile, '-ss', '00:00:03.000', '-vframes', '1', outputImage]);
         files[i].proc.stdout.on('data', function(data){
           console.log('stdout: ' + data);
         });

         files[i].proc.stderr.on('data', function(data){
           console.log('stdout: ' + data);
         });

         files[i].proc.on('close', function(code){
           console.log('stdout: ' + code);
         });
       } else {
         console.log('Thumbnail Already Exists');
       }
    });
  }
}



module.exports.vlcPlayFile = vlcPlayFile;
module.exports.makeThumbnails = makeThumbnails;
