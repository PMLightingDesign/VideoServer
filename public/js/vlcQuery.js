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

var playerTemplate;
var playlistTemplate;
var playerDOM;

/*
{ mute: false,
  pause: false,
  duration: 294.066667,
  volume: 100,
  filename: 'GGU1P6lBW6Q',
  path: 'https://youtu.be/GGU1P6lBW6Q',
  'media-title': 'Richard Wagner - Ride Of The Valkyries',
  'playlist-pos': 0,
  'playlist-count': 1,
  loop: false,
  fullscreen: true,
  'sub-visibility': true,
  time: 11.7 }

*/

function setPlayer(data){
  //console.log(data)
  data = JSON.parse(data);
  data.prettyTime = ft(Math.round(data.time)) + " / " + ft(Math.round(data.duration));
  data.width = Math.round((data.time / data.duration) * 100);
  let html_data = playerTemplate({
    info: data
  });
  if(typeof(playerDOM) != 'undefined'){
    playerDOM.html(html_data);
  }
}

function setPlaylist(data){
  //console.log(window.location);
  data = JSON.parse(data);
  if(window.location.pathname == '/playlist'){
    let html_data = playlistTemplate({
      plist: data.playlist
    });
    $('#playlist-info').html(html_data);
  }
}

var apiSock;

$(document).ready(function() {
  Handlebars.registerHelper("debug", function(optionalValue) {
    console.log("Current Context");
    console.log("====================");
    console.log(this);

    if (optionalValue) {
      console.log("Value");
      console.log("====================");
      console.log(optionalValue);
    }
  });

  playerDOM = $('#player-info');
  $.ajax('/templates/playlist.hbs').done(function(temp){
    playlistTemplate = Handlebars.compile(temp);

    $.ajax('/templates/player.hbs').done(function(temp){
      playerTemplate = Handlebars.compile(temp);
      let html_data = playerTemplate({
        info: dummyData
      });
      $('#player-info').html(html_data);
      $("[name='loop-check']").bootstrapSwitch();

      let wsPath = routeToApi();
      console.log(wsPath);
      apiSock = new WebSocket(wsPath);
      apiSock.onopen = function (event) {
        apiSock.send("Client Online");
      };
      apiSock.onmessage = function (event) {
        setPlayer(event.data);
        setPlaylist(event.data);
      };
      apiSock.onclose = function (event){
        console.log('API Closed');
      };
    });
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
    if(isNaN(secs)){
      secs = "00";
    }
    ret += "" + secs;
    return ret;
}
