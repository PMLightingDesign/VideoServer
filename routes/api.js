const express = require('express');
let router = express.Router();

const FileList = require('../appModules/fileList.js').FileList;
let globals = require('../appModules/globals.js');
const vlcPlayFile = require('../appModules/vlc.js').vlcPlayFile;
const makeThumbnails = require('../appModules/vlc.js').makeThumbnails;
const fs = require('fs');

let child;
let last;
let presetMovie = "4_products_quotes_031816.mov";
let looping = false;

function getFilelist(){
  let fl = new FileList(globals.video);
  for(let i = 0 ;i < fl.files.length; i++){
    if(fl.files[i].base == presetMovie){
      fl.files[i].isDefault = true;
    }
  }
  return fl.files;
}

function getAudioList(){
  let fl = new FileList(globals.audio);
  for(let i = 0 ;i < fl.files.length; i++){
    if(fl.files[i].base == presetMovie){
      fl.files[i].isDefault = true;
    }
  }
  createPlaylist(fl.files);
  return fl.files;
}

function createPlaylist(files){
  let fileString = "";
  for(let i = 0; i < files.length; i++){
    fileString += globals.audio + '/' + files[i].base + '\n';
  }
  let configPath = globals.audio + '/' + 'playlist.m3u';
  fs.writeFile(configPath, fileString, function(err){
    if(err){
      console.log('err');
    }
  });
}

function generateThumbs(){
  let files = getFilelist();
  makeThumbnails(files);
}

generateThumbs();

router.use('/reloadThumbs', function(req, res, next){
  generateThumbs();
  res.json({
    status: "Okay"
  });
});

/* GET home page. */
router.get('/vidList', function(req, res, next) {
  let files = getFilelist();
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(files));
});

router.use('/play/default', function(req, res, next) {
  if(typeof(vlc) != 'undefined'){
    vlc.kill('SIGINT');
  }
  vlc = vlcPlayFile(globals.video + '/' + presetMovie, looping);
  res.send("Okay: " + req.params.video);
});

router.use('/play/:video', function(req, res, next) {
  if(typeof(vlc) != 'undefined'){
    vlc.kill('SIGINT');
  }
  vlc = vlcPlayFile(globals.video + '/' + req.params.video, looping);
  res.send("Okay: " + req.params.video);
});

router.use('/vlc/info', function(req, res, next){
  if(typeof(vlc) != 'undefined'){
    vlc.stdin.write("get_time\nget_length\nget_title\n");
    let resp = vlc.vsDataHook;
    resp.loopStatus = looping;
    res.json(resp);
  } else {
    res.json({type: "none", loopStatus: looping});
  }
});

router.use('/vlc/help', function(req, res, next){
  if(typeof(vlc) != 'undefined'){
    vlc.stdin.write("help\n");
    res.json(vlc.vsDataHook);
  } else {
    res.json({type: "none"});
  }
});

router.use('/vlc/command/:action', function(req, res, next){
  if(typeof(vlc) != 'undefined'){
    vlc.stdin.write(req.params.action + "\n");
    res.json(vlc.vsDataHook);
  } else {
    res.json({type: "none"});
  }
});

router.use('/preset/:video', function(req, res, next){
  presetMovie = req.params.video;
  res.json({status: "Okay"});
});

router.use('/loop/:state', function(req, res, next){
  console.log(req.params.state);
  looping = req.params.state;
  res.json({
    status: "Setting loop to",
    state: req.params.state
  });
});

//Audio

router.use('/playSound/:audio', function(req, res, next) {
  if(typeof(vlc) != 'undefined'){
    vlc.kill('SIGINT');
  }
  vlc = vlcPlayFile(globals.audio + '/' + req.params.audio, looping);
  res.send("Okay: " + req.params.audio);
});

router.use('/playAudioPlaylist', function(req, res, next) {
  if(typeof(vlc) != 'undefined'){
    vlc.kill('SIGINT');
  }
  vlc = vlcPlayFile(globals.audio + '/playlist.m3u', looping);
  res.send("Okay: " + req.params.audio);
});

module.exports = router;
module.exports.getFilelist = getFilelist;
module.exports.getAudioList = getAudioList;
