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

var stream = net.connect(5555).pipe(JSONStream.parse([true]))
var ev = emitStream(stream)

ev.on('command', function (t) {
    console.log('# command: ' + t)
})
