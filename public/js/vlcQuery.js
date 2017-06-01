let dummyData = {
  width: 0,
  time: '0:00',
  pos: 0,
  end: 100,
  file: "Nothing Playing",
  loopStatus: false
}

$(document).ready(function() {
  var playerTemplate;
  $.ajax('/templates/player.hbs').done(function(temp){
    playerTemplate = Handlebars.compile(temp);
    let html_data = playerTemplate({
      info: dummyData
    });
    $('#player-info').html(html_data);
    $("[name='loop-check']").bootstrapSwitch();

    setInterval(function(){
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/vlc/info' + name, true);
      xhr.onload = function () {
        let playInfo = JSON.parse(this.responseText);
        if (playInfo.type == 'playbackInfo'){
          playInfo.width = Math.round((playInfo.pos / playInfo.end) * 100);
          playInfo.prettyTime = ft(playInfo.pos) + " / " + ft(playInfo.end);
          playInfo.idName = playInfo.file.split('.')[0];
          console.log(playInfo.file);
          let html_data = playerTemplate({
            info: playInfo
          });
          $('#player-info').html(html_data);
        } else {
          dummyData.loopStatus = playInfo.loopStatus;
          let html_data = playerTemplate({
            info: dummyData
          });
          $('#player-info').html(html_data);
        }
      };
      xhr.send();
    }, 1000);
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
