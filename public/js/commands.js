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
