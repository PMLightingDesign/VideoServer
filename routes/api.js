const express = require('express');
let router = express.Router();

const FileList = require('../appModules/fileList.js').FileList;
let globals = require('../appModules/globals.js');
const fs = require('fs');

router.use('/api/setPreset', function(req, res, next){
  res.json(({msg: 'okay'}));
});

module.exports = router;
