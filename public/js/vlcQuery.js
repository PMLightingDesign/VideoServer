let dummyData = { mute: false,
  pause: false,
  duration: 0,
  volume: 100,
  filename: 'none',
  path: '/no/media',
  'media-title': 'None',
  'playlist-pos': 0,
  'playlist-count': 0,
  loop: false,
  fullscreen: true,
  'sub-visibility': true,
  time: 0
}

function routeToApi(){
  var loc = window.location, new_uri;
  if (loc.protocol === "https:") {
      new_uri = "wss:";
  } else {
      new_uri = "ws:";
  }
  new_uri += "//" + loc.host;
  new_uri += loc.pathname + "/api";
  return new_uri;
}

$(document).ready(function() {
  let wsPath = routeToApi();
  console.log(wsPath);
  var apiSock = new WebSocket(wsPath);
  apiSock.onopen = function (event) {
    apiSock.send("Here's some text that the server is urgently awaiting!");
  };
  apiSock.onclose = function (event){
    console.log('API Closed');
  };
  setInterval(function(){
    apiSock.send("Data!");
  }, 2000);
  var playerTemplate;
  $.ajax('/templates/player.hbs').done(function(temp){
    playerTemplate = Handlebars.compile(temp);
    let html_data = playerTemplate({
      info: dummyData
    });
    $('#player-info').html(html_data);
    $("[name='loop-check']").bootstrapSwitch();
  });
});

function ft(time)
{
    // Hours, minutes and seconds
    let hrs = ~~(time / 3600);
    let mins = ~~((time % 3600) / 60);
    let secs = time % 60;
    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = "";
    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}
