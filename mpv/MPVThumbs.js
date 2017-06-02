const cp = require('child_process');
const fs = require('fs')

module.exports = function(globals, files){
  for(let i = 0; i < files.length; i++){
    for(let i = 0; i < files.length; i++){
      // /ffmpeg -i $uploaded_file -ss 00:00:01.000 -vframes 1 output.png
      let currentFile = files[i].fullPath;
      let outputImage = globals.thumbs + '/' + files[i].name + '.png';
      fs.stat(outputImage, function(err, data) {
         if (err){
           console.log('Making new Thumbnail');
           files[i].proc = cp.spawn('ffmpeg', ['-i', currentFile, '-ss', '00:00:03.000', '-vframes', '1', outputImage]);
           files[i].proc.stdout.on('data', function(data){
             console.log('stdout: ' + data);
           });

           files[i].proc.stderr.on('data', function(data){
             console.log('stdout: ' + data);
           });

           files[i].proc.on('close', function(code){
             console.log('Process Ended Properly');
           });
         } else {
           console.log('Thumbnail Already Exists');
         }
      });
    }
  }
}
