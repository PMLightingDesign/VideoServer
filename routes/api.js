const express = require('express');
let router = express.Router();

const FileList = require('../appModules/fileList.js').FileList;
const globals = require('../appModules/globals.js');
const vlcPlayFile = require('../appModules/vlc.js').vlcPlayFile;

let child;
let last;

/* GET home page. */
router.get('/vidList', function(req, res, next) {
  let fl = new FileList(globals.video);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(fl.files));
});

router.post('/play/:video', function(req, res, next) {
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

module.exports = router;
