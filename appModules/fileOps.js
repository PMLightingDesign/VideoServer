const fs = require('fs');

function saveGlobals(gl, callback){
  let globalString = JSON.stringify(gl, null, '\t');
  fs.writeFile('config.json', globalString, function(err){
    if(err){
      console.log(err);
    } else {
      console.log('Config Save: Success!');
    }
    callback();
  });
}

function loadGlobals(configPath){
  let data = fs.readFileSync(configPath);
  return JSON.parse(data.toString());
}

module.exports.saveGlobals = saveGlobals;
module.exports.loadGlobals = loadGlobals;
