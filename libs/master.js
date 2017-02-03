var os = require('os');
const net = require('net');
var iface = os.networkInterfaces();
// This file is called ONLY if no master is present.
// setPort from earlier is used to define listening port.
if (os.platform() == 'linux') {
  var host = iface['eth0'][0]['address'];
} else if (os.platform() == 'win32') {
  var host = iface['Ethernet'][1]['address'];
}

const server = net.createServer({pauseOnConnect: false}, function(socket) {
  console.log('[!] ' + socket.remoteAddress + ' connected as node');
  socket.on('end', function() {
    console.log('[!] Disconnect from client');
  });
  socket.on('error', function(err) {
    if (err['code'] == 'ECONNRESET') {
      console.log('[!] connection was reset by client.');
    } else {
      console.log('[!] connection reset by node');
    }
  });
  forKey = socket.remoteAddress.split(":");
  socket.resume();
  socket.write(host + ":"+ Math.round((Math.random() * 100000) + 9096));
  socket.pipe(socket);
});

server.on('error', function(err) {
  if (err['code'] == 'ECONNRESET') {
    console.log('[!] connection was reset by client.');
  } else {
    console.log('[!] connection reset by node');
  }
});


var masTime = new Date();
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "May", "Aug", "Sept", "Oct", "Nov", "Dec"];

server.listen(setPort, function() {
    console.log('[+] Chained as master');
    console.log('[+] Our IP is ' + host + ':' + setPort);
});
console.log("[~] started on: " + months[masTime.getMonth()] + " " + masTime.getDate() + " " + masTime.getFullYear() + " at " + masTime.getHours() + ":" + masTime.getMinutes());
