function playVideo(name){
  console.log(name + ' will play now');
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/play/' + name, true);
  xhr.onload = function () {
      // do something to response
      console.log(this.responseText);
  };
  xhr.send();
}

function sendCommand(action){
  console.log("Action: " + action);
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/vlc/command/' + action, true);
  xhr.onload = function () {
      // do something to response
      console.log(this.responseText);
  };
  xhr.send();
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
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/loop/' + object.checked, true);
  xhr.onload = function () {
      // do something to response
      console.log(this.responseText);
  };
  xhr.send();
}
