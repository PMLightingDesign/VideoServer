var express = require('express');
var router = express.Router();
const getAudioList = require('./api.js').getAudioList;
let globals = require('../appModules/globals.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  let files = getAudioList();
  res.render('audio', { title: 'Audio Manager', data: files });
});

module.exports = router;
