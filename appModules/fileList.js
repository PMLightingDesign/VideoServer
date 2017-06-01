'use strict';
//Creates a file list objects
const getDuration = require('get-video-duration');
let path = require('path');
let fs = require('fs');

class FileList {
  constructor(dir){
    console.log("FS: Populating latest files");
    this.root = dir;
    let fileNames = fs.readdirSync(dir);
    this.files = [];
    for (let i = 0; i < fileNames.length; i++){
      let thisFile = path.parse(fileNames[i]);
      if(thisFile.ext != '.m3u'){
        this.files.push(thisFile);
      } else {
        console.log("FS: Ignoring Playlist");
      }
    }
  }

  filter(extension){
    let filtered = [];
    for(let i = 0; i < this.files.length; i++){
      if(this.files[i].ext === extension){
        filtered.push(this.files[i]);
      }
    }
    return filtered;
  }

  static validate(directory) {
    fs.stat(directory, function(err, stats) {
      if (err && err.errno === 34) {
        console.log("Can not find directory");
        return undefined;
      } else {
        return new FileList(directory);
      }
    });
  }
}

module.exports.FileList = FileList;
