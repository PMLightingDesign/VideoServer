const express = require('express');
let router = express.Router();

const FileList = require('../appModules/fileList.js').FileList;
let globals = require('../appModules/globals.js');
const vlcPlayFile = require('../appModules/vlc.js').vlcPlayFile;
const makeThumbnails = require('../appModules/vlc.js').makeThumbnails;

let child;
let last;
let presetMovie = "4_products_quotes_031816.mov";

function getFilelist(){
  let fl = new FileList(globals.video);
  for(let i = 0 ;i < fl.files.length; i++){
    if(fl.files[i].base == presetMovie){
      fl.files[i].isDefault = true;
    }
  }
  return fl.files;
}

function generateThumbs(){
  let files = getFilelist();
  makeThumbnails(files);
}

generateThumbs();

/* GET home page. */
router.get('/vidList', function(req, res, next) {
  let files = getFilelist();
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(files));
});

router.use('/play/:video', function(req, res, next) {
  if(typeof(vlc) != 'undefined'){
    vlc.kill('SIGINT');
  }
  vlc = vlcPlayFile(globals.video + '/' + req.params.video, last);
  res.send("Okay: " + req.params.video);
});

router.use('/vlc/info', function(req, res, next){
  if(typeof(vlc) != 'undefined'){
    vlc.stdin.write("get_time\nget_length\nget_title\n");
    res.json(vlc.vsDataHook);
  } else {
    res.json({type: "none"});
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

module.exports = router;
module.exports.getFilelist = getFilelist;
