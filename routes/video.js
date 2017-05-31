const express = require('express');
let router = express.Router();

const getFilelist = require('./api.js').getFilelist;
let globals = require('../appModules/globals.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  let dataJSON = getFilelist();
  console.log(dataJSON);
  res.render('video', { title: 'Video Manager', data: dataJSON});
});

module.exports = router;
