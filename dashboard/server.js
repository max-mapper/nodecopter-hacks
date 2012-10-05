var emitStream = require('emit-stream')
var net = require('net')
var arDrone = require('ar-drone')
var client  = arDrone.createClient()
var JSONStream = require('JSONStream')

function dispatchDroneCommand(obj) {
  if (obj.takeoff) {
    client.takeoff()
    client.takeoff()
    client.takeoff()
    return
  }
  if (obj.land) return client.land()
  if (obj.start) return client.front(0.2)
  if (obj.stop) return client.stop()
  if (obj.up) return client.up(obj.up)
  if (obj.down) {
    client.down(0.5)
    client.down(0.5)
    setTimeout(function() {
      client.down(0)
      client.down(0)
    }, 1000)
    return
  }
  if (obj.reset) return client.disableEmergency()
  if (obj.flip) return client.animate('flipLeft', 15)
  if (obj.dir) {
    console.log('spinning')
    client.clockwise(0.5)
    setTimeout(function() {
      console.log('stopping')
      client.clockwise(0)
    }, obj.dir * 10)
    return
  }
  console.log('no match', Object.keys(obj))
  return client.stop()
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