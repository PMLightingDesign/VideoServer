const globals = require('../appModules/globals.js');
const FileList = require('../appModules/fileList.js');

let fl = new FileList(globals.audio);
console.log(fl.files);
