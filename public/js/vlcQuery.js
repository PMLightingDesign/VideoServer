$(document).ready(function() {
    setInterval(function(){
      console.log('Calling play with ' + name);
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/vlc/info' + name, true);
      xhr.onload = function () {
          // do something to response
          console.log(this.responseText);
          let playInfo = JSON.parse(this.responseText);
          if (playInfo.type == 'playbackInfo'){
            $('#player-info').html(renderPlayer(playInfo));
          } else {
            $('#player-info').html("<h6>Nothing Playing</h6>");
          }
      };
      xhr.send();
    }, 1000);
});

function renderPlayer(playInfo){
  let html = "";
  html += '<h6>' + playInfo.file + '</h6>';
  html += '<div class="progress">';
  html += '<div class="progress-bar" role="progressbar" aria-valuenow="'
  html += playInfo.pos;
  html += '" aria-valuemin="0" aria-valuemax="'
  html += playInfo.end;
  html += '" style="width:'
  html += Math.round((playInfo.pos / playInfo.end) * 100);
  html += '%">';
  html += '</div>'
  html += '</div>'
  html += '<h6>' + ft(playInfo.pos) + " / " + ft(playInfo.end) + '<h6>';
  return html;
}

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
