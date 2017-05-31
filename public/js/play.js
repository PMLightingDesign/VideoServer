function playVideo(name){
  console.log('Calling play with ' + name);
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/play/' + name, true);
  xhr.onload = function () {
      // do something to response
      console.log(this.responseText);
  };
  xhr.send();
}
