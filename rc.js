/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

fs = require('fs');

processReq = function(req, res) {
    
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=UTF-8'
    });
    
    // Test basic response:
    //res.send('<h1>Hello from GROOO!!</h1>');
    //res.end('<script src="http://jeromeetienne.github.io/virtualjoystick.js/virtualjoystick.js"></script>');
    
    // Dumb file server
    fs.readFile('html/joy.html', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      res.end(data);
    });
    
};

// This is a basic way to listen, just for sanity check...
var http = require('http');
http.createServer(processReq).listen(9080, "");

// This is a better library, one we actually use for the app...
var express = require('express');
var app = express();
var path = require('path');

// Config server to serve static content (e.g html/joy.html)
app.use(express.static(path.join(__dirname, 'html')));

var dgram = require('dgram');
var PORT = 1234;
var HOST = 'none'; //192.168.2.109';
var client = dgram.createSocket('udp4');

// Add REST interface to get coordinates by AJAX from virtualjoystick.js..
//   ...and act as a broker, relaying x,y to the IoT device via UDP
app.get('/xy', function(req, res) {
    console.log('x,y: '+req.query.x+','+req.query.y);
    var message = new Buffer(req.query.x+','+req.query.y);
    // TODO - optimize, maybe run a queue in a separate thread..
    if( HOST!=='none') {
        client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
            if (err) throw err;
            console.log('UDP message sent to ' + HOST +':'+ PORT);
            // client.close();
        });
    }

    res.send('OK');
   // res.send('{"id": 1,"name":"Matt","band":"BBQ Brawlers"}');
});

app.listen(3001);
console.log('Listening on port 3001, try <ip>:3001/html/joy.html');

// OK, now let's try to listen to the nodeMCU identify itself...
udpsock = dgram.createSocket('udp4');
udpsock.on('message', function (msg, info){
    console.log("got UDP msg: "+msg.toString());
    HOST = msg.toString();
 });

udpsock.bind(6666);
console.log('Listening for UDP on port 6666...');

