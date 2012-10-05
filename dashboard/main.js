var socket

function connectSocket() {
  var ip = "ve.5bpbxlsy.vesrv.com:5000"
  if (typeof socket !== "undefined") socket.disconnect()
  var options = {secure: false, reconnect: false, 'force new connection': true}
  socket = io.connect(ip, options)
}

function disconnectSocket() {
  if (typeof socket !== "undefined") socket.disconnect()
}

function doMagicDroneStuff() {
  connectSocket()
  
  $('a.command').click(function(e) {
    var command = {}
    command[$(e.target).attr('data-command')] = true
    socket.emit('command', command)
  })
  
  $('a.reconnect').click(function(e) {
    connectSocket()
  })
  
  $('a.disconnect').click(function(e) {
    disconnectSocket()
  })
  
  $('a.spin').click(function(e) {
    socket.emit('command', {dir: lastDir})
  })
  

  function deviceOrientationHandler(tiltLR, tiltFB, dir, motionUD) {
    if (!window.socket || !window.socket.socket.connected) return false

    document.getElementById("doTiltLR"   ).innerHTML = Math.round(tiltLR);
    document.getElementById("doTiltFB"   ).innerHTML = Math.round(tiltFB);
    document.getElementById("doDirection").innerHTML = Math.round(dir);
    document.getElementById("doMotionUD" ).innerHTML = motionUD;

    // Apply the transform to the image
    document.getElementById("imgLogo").style.webkitTransform = "rotate(" + 
     tiltLR + "deg) rotate3d(1,0,0, " + (tiltFB * -1) + "deg)";
    document.getElementById("imgLogo").style.MozTransform = "rotate(" + tiltLR + "deg)";
    document.getElementById("imgLogo").style.transform = "rotate(" + tiltLR + 
    "deg) rotate3d(1,0,0, " + (tiltFB * -1) + "deg)";

    // window.socket.emit('motion',{
    //  'tiltLR': tiltLR,
    //  'tiltFB': tiltFB,
    //  'dir': dir,
    //  'motionUD': motionUD,
    // });
    lastTiltLR = tiltLR
    lastTileFB = tiltFB
    lastDir = dir
  }                                                     


  if (window.DeviceOrientationEvent) {
   console.log("DeviceOrientation is supported");
  } else if (window.OrientationEvent) {
   console.log("MozOrientation is supported");
  }
  
  if (window.DeviceOrientationEvent) {
    document.getElementById("doEvent").innerHTML = "DeviceOrientation";
    // Listen for the deviceorientation event and handle the raw data
    window.addEventListener('deviceorientation', function(eventData) {
      // gamma is the left-to-right tilt in degrees, where right is positive
      var tiltLR = eventData.gamma;

      // beta is the front-to-back tilt in degrees, where front is positive
      var tiltFB = eventData.beta;

      // alpha is the compass direction the device is facing in degrees
      var dir = eventData.alpha

      // deviceorientation does not provide this data
      var motUD = null;

      // call our orientation event handler
      deviceOrientationHandler(tiltLR, tiltFB, dir, motUD);
    }, false);
  } else if (window.OrientationEvent) {
    document.getElementById("doEvent").innerHTML = "MozOrientation";
    window.addEventListener('MozOrientation', function(eventData) {
      // x is the left-to-right tilt from -1 to +1, so we need to convert to degrees
      var tiltLR = eventData.x * 90;

      // y is the front-to-back tilt from -1 to +1, so we need to convert to degrees
      // We also need to invert the value so tilting the device towards us (forward) 
      // results in a positive value. 
      var tiltFB = eventData.y * -90;

      // MozOrientation does not provide this data
      var dir = null;

      // z is the vertical acceleration of the device
      var motUD = eventData.z;

      // call our orientation event handler
      deviceOrientationHandler(tiltLR, tiltFB, dir, motUD);
    }, false);
    } else {
      document.getElementById("doEvent").innerHTML = "Not supported on your device or browser."
    }
}

$(function() {
  doMagicDroneStuff()
})