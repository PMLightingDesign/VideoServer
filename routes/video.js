const express = require('express');
let router = express.Router();

const FileList = require('../appModules/fileList.js').FileList;
const globals = require('../appModules/globals.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  let fl = new FileList(globals.video);
  let dataJSON = fl.files;
  res.render('video', { title: 'Video Manager', data: dataJSON});
});

module.exports = router;
