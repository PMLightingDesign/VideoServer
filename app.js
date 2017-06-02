const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({
  server,
  clientTracking: true
 });

const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const hbs = require('hbs');

const cp = require('child_process');
const util = require('util');
let globals = require('./appModules/globals.js');
let saveGlobals = require('./appModules/fileOps.js').saveGlobals;
let loadGlobals = require('./appModules/fileOps.js').loadGlobals;
const FileList = require('./appModules/fileList.js');
const makeThumbs = require('./mpv/MPVThumbs.js');

let tmpGlobals = loadGlobals(__dirname + '/config.json');
for(key in tmpGlobals){
  globals[key] = tmpGlobals[key];
}

function mt(){
  let fl = new FileList(globals.video);
  makeThumbs(globals, fl.files);
}

mt();

//saveGlobals(globals);
console.log(globals);

let lastMsg;

let player = cp.fork('mpv/MPVHandler.js');
player.on('message', function(msg){
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      let lastMsg = JSON.stringify(msg);
      client.send(lastMsg);
    }
  });
});

//Define routes
let api = require('./routes/api.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//Register view engine components
hbs.registerPartials(__dirname + '/views/parts');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Default redirect to video
app.all('/', function(req, res, next){
  res.redirect('/video');
});

//Everything routes to api
app.use('/video', function(req, res, next){
  let fl = new FileList(globals.video);
  res.render('video', { title: 'Video Manager', data: fl.files});
});

app.use('/audio', function(req, res, next){
  let fl = new FileList(globals.audio);
  res.render('audio', { title: 'Audio Manager', data: fl.files, globals: globals});
});

app.use('/web', function(req, res, next){
  res.render('web', { title: 'Web Manager'});
});

app.use('/playlist', function(req, res, next){
  res.render('playlist', { title: 'Playlist Manager'});
});

app.use('/api/preset/:filename', function(req, res, next){
  globals.presetMovie = globals.video + '/' + req.params.filename;
  res.json({
    okay: globals.presetMovie
  });
});

app.use('/api/playPreset', function(req, res, next){
  let command = {
    'command' : [
      'loadfile',
      globals.presetMovie
    ]
  }
  player.send(JSON.stringify(command));
  res.json({
    okay: globals.presetMovie
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

wss.on('connection', function connection(ws, req) {
  const location = url.parse(req.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', function incoming(message) {
    player.send(message);
  });

  ws.send(lastMsg);
});

server.listen(8000, function listening() {
  console.log('Listening on %d', server.address().port);
});

process.on('SIGINT', function(){
  saveGlobals(globals, function(){
    server.close();
    player.kill();
    process.exit(0);
  });
});
