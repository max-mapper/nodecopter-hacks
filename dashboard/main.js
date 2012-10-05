
var socket = io.connect('http://localhost:8000')

$(function() {
  $('a').click(function(e) {
    socket.emit('command', $(e.target).attr('data-command'))
  })
})