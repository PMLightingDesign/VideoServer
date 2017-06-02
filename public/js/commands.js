function playURL(url){
  let action = {
    'command' : [
      'loadfile',
      url
    ]
  }
  sendCommand(action)
}

function sendCommand(action){
  apiSock.send(JSON.stringify(action));
}

function setPresetVideo(name){
  console.log(name + ' is now preset');
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/preset/' + name, true);
  xhr.onload = function () {
      // do something to response
      console.log(this.responseText);
      location.reload();
  };
  xhr.send();
}

function setLoopState(object){
  sendCommand({'command': ['set_property', 'loop', object.checked]});
}

function reloadThumbs(){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/reloadThumbs', true);
  xhr.onload = function () {
      // do something to response
      console.log(this.responseText);
  };
  xhr.send();
}

function playAll(){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/playAudioPlaylist', true);
  xhr.onload = function () {
      // do something to response
      console.log(this.responseText);
  };
  xhr.send();
}
