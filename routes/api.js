const express = require('express');
let router = express.Router();

const FileList = require('../appModules/fileList.js').FileList;
let globals = require('../appModules/globals.js');
const fs = require('fs');

router.use('/video', function(req, res, next){
  res.render('video', { title: 'Video Manager'});
});

router.ws('/*/api', function(ws, req){
  ws.on('message', function(msg) {
    console.warn(msg);
  });
  console.warn('socket', req.testing);
});

module.exports = router;
