/*
  Description:
  This file is designed to scan and perform callouts to supposed cluster nodes;
  if a master is found the node will perform a challenge to become a node.
  otherwise it will become its own master.

  NOTE: In a situation where multiple masters are needed a portion of this file
  should be edited as directedly below for both a new master and optional nodes.

*/
//Prereq
var os = require('os');
var net = require('net');
var sock = new net.Socket();
sock.setMaxListeners(0);
// Initiate callouts;

// Variables
var iface = os.networkInterfaces();
var host = iface['Ethernet'][1]['address'];
var hport = Math.round((Math.random() * 1000) + 1);
// hport will be the host listening port for challenges only.
var setPort = 9095;
// setPort is a user defined port for finding Master or clutser nodes.
var searchIP = host.split(".");
var fromHost = searchIP[0] + "." + searchIP[1] + "." + searchIP[2] + ".";
nodes = [];

// Functions
function searchHost(searchPort) {
  var i = 0;
  while (i <= 256) {
      (function(searchPort) {
      sock.setTimeout(2000, function() {
          process.stdout.write("trying: " + fromHost + i + ":" + searchPort + "\r");
        sock.destroy();
      });
      sock.connect(searchPort, (fromHost + i), function() {
        nodes.push('> ' + fromHost + i + ":" + searchPort);
        console.log('FOUND: ' + searchPort);
      });
      sock.on('data', function(data) {
        console.log((fromHost + i) + ":" + searchPort + ": " + data);
        sock.destroy();
      });
      sock.on('error', function(e) {
        sock.destroy();
      });
    })(searchPort);
      i++;
  }
  if (nodes.length <= 0) {
    console.log('No hosts found');
  } else {
    console.log(nodes);
  }
}
console.log('Scanning for Master...');

setTimeout(function() {
    searchHost(9195);
}, 10000);