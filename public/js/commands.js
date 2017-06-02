function tempAlert(msg,duration)
{
   var el = document.createElement("div");
   el.setAttribute("class", "alert alert-success");
   el.setAttribute("style","position:fixed;top: 50%;left: 50%;width:30em;height:6em;margin-top: -9em; margin-left: -15em; word-wrap: break-word;");
   el.innerHTML = msg;
   setTimeout(function(){
    el.parentNode.removeChild(el);
   },duration);
   document.body.appendChild(el);
}

function playURL(url){
  let action = {
    'command' : [
      'loadfile',
      url
    ]
  }
  sendCommand(action)
}

function appendList(url){
  tempAlert("Added: " + url, 2000);
  let action = {
    'command' : [
      'loadfile',
      url,
      'append-play'
    ]
  }
  sendCommand(action)
}

function removeList(id){
  let action = {
    'command' : [
      'playlist-remove',
      id
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
