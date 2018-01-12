/*
    Author Dillon Dickerson
*/

var forever = require('forever-monitor');

var child = new (forever.Monitor)('./src/websocket.js', {
    max: 3,
    silent: true,
    args: []
  });

  child.on('exit', function () {
    console.log('websocket has tried to restart 3 times and will now stop trying to restart');
  });

  child.start();
