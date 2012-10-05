var emitStream = require('emit-stream')
var net = require('net')
var arDrone = require('ar-drone')
var client  = arDrone.createClient()
var JSONStream = require('JSONStream')

function dispatchDroneCommand(obj) {
  if (obj.takeoff) return client.takeoff()
  if (obj.land) return client.land()
  if (obj.stop) return client.stop()
  if (obj.clockwise) return client.clockwise(obj.clockwise)
  if (obj.backflip) return client.backflip()
  console.log('sending animate')
  return client.animateLeds('blinkRed', 5, 2)
}

function createDroneStream() {
  var connection = net.connect(5555, 've.5bpbxlsy.vesrv.com', function() {
    console.log('connected!')
  })
  var jsonParseStream = JSONStream.parse([true])
  connection.pipe(jsonParseStream)
  var ev = emitStream(jsonParseStream)
  ev.on('command', function (t) {
    console.log('# command: ', t)
    dispatchDroneCommand(t)
  })
  connection.on('end', function() {
    console.log('disconnected!')
    createDroneStream()
  })
}

createDroneStream()