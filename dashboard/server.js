var http = require('http')
var socketio = require('socket.io')
var fs = require('fs')
var ecstatic = require('ecstatic')(__dirname)
var arDrone = require('ar-drone')
var client  = arDrone.createClient()
var io

function initWebServer(cb) {
  if (!cb) cb = function(){}
  var server = http.createServer(function(req, res) {
    if (req.url.match(/socket\.io/)) return
    ecstatic(req, res)
  })
  io = socketio.listen(server)
  io.set('log level', 1)
  console.log('Listening on :8000')
  server.listen(8000, cb)
}



initWebServer(function() {
  io.sockets.on('connection', function(socket) {
    socket.on('command', function(obj) {
      if (obj === "takeoff") return client.takeoff()
      if (obj === "land") return client.land()
      if (obj === "stop") return client.stop()
      if (obj.clockwise) return client.clockwise(obj.clockwise)
    })
  })
})