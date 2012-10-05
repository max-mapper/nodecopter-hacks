var emitStream = require('emit-stream')
var JSONStream = require('JSONStream')
var net = require('net')
var socketio = require('socket.io')
var http = require('http')
var EventEmitter = require('events').EventEmitter
var url = require('url')
var qs = require('querystring')
var fs = require('fs')
var ecstatic = require('ecstatic')(__dirname)
var io, remoteEv

var server = (function () {
    remoteEv = createEmitter()

    return net.createServer(function (stream) {
        emitStream(remoteEv)
            .pipe(JSONStream.stringify())
            .pipe(stream)
            
    })
})()

server.listen(5555)

var EventEmitter = require('events').EventEmitter

function createEmitter () {
    var ev = new EventEmitter
    return ev
}

function initWebServer(cb) {
  if (!cb) cb = function(){}
  var server = http.createServer(function(req, res) {
    if (req.url.match(/command/)) {
      var commands = qs.parse(url.parse(req.url).query)
      console.log('qs command', commands)
      remoteEv.emit('command', commands)
      return res.end('hi')
    }
    if (req.url.match(/socket\.io/)) return
    ecstatic(req, res)
  })
  io = socketio.listen(server)
  io.set('log level', 1)
  console.log('Listening on :5000')
  server.listen(5000, cb)
}

initWebServer(function() {
  io.sockets.on('connection', function(socket) {
    socket.on('command', function(obj) {
      console.log('socket command', obj)
    })
    socket.on('motion', function(obj) {
      console.log('socket motion', obj)
    })
  })
})
