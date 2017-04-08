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
var DEVICE_PORT = 1234;
var DEVICE_IP = 'NA'; //192.168.2.109';
var client = dgram.createSocket('udp4');

// initialize the instanteneous Vx,Vy commands
var commVX=0;
var commVY=0;

var hosts = [];
//var host_cmds = {};

/*
 *  REST interface to get Vx,Vy commands by AJAX from a controller (e.g. smartphone),
 *     running joy.html+virtualjoystick.js (which he gets statically served)
 *     
 *  save the command if the controller is the active one; 
 *   also return its status so he can visually present it to the user..   
 */

app.get('/xy', function(req, res) {

    host = req.connection.remoteAddress.toString();
    if( hosts.indexOf(host)===-1 ) {
        hosts.push(host);
        console.log('New controller, IP='+host);
        console.log('curr controllers IPs list: '+hosts);
    }    
    // host_cmds[host] = [req.query.x, req.query.y]; 
    if( !(req.query.x==='0' && req.query.y==='0') ) {        
        console.log('command from '+host+': x,y = '+req.query.x+','+req.query.y);  
    }
        
    if (hosts[ctrlInd]===host) {
        res.send('enabled');
        commVX = req.query.x;
        commVY = req.query.y;
    } else {
        res.send('disabled');
    }    
    //console.log(host_cmds);
});

/**
 *  Start listening to controllers..
 */
app.listen(3001);
console.log('Listening on port 3001, try <ip>:3001/html/joy.html');

/* 
 *  Listen to IoT device to identify itself...
 */
udpsock = dgram.createSocket('udp4');
udpsock.on('message', function (msg, info){
    console.log("got UDP msg: "+msg.toString());
    DEVICE_IP = msg.toString();
 });

udpsock.bind(6666);
console.log('Listening for self-discovery UDP on port 6666...');


/* 
 *  Periodically send command update by UDP to IoT device,
 *   and also check for timeout for controller switch..
 */
var i=0;
var ctrlInd = 0;
var update_dt_ms = 50 ;
var switch_dt_ms = 8 * 1000;

setInterval(function(){
    // console.log('test');
    if( ! hosts.length ) {
        return;
    }
    if(++i > switch_dt_ms/update_dt_ms) { // switch controller :)
        ctrlInd = (ctrlInd+1) % hosts.length;
        if(hosts.length>1) {
            console.log("Switched active controller to "+hosts[ctrlInd]);
            // initialize to no-motion till the newly-in-power controller starts sending meaningful commands
            commVX = 0; 
            commVY = 0;            
        }
        i=0;
    }
    //console.log('tick tock');    
    // var actCtrlVxy = host_cmds[hosts[ctrlInd]];
    // !! hack - reversing sign because of the implementation inside the IoT..
    var message = new Buffer(-commVX+','+commVY); 
    // var message = new Buffer(actCtrlVxy[0]+','+actCtrlVxy[1]);
    // console.log(actCtrlVxy[0]+','+actCtrlVxy[1]);
    if( DEVICE_IP!=='NA' ) { // && !(commVX===0 && commVY===0) ) {        
        client.send(message, 0, message.length, DEVICE_PORT, DEVICE_IP, function(err, bytes) {
            if (err) throw err;
            // console.log('UDP message sent to ' + DEVICE_IP +':'+ DEVICE_PORT);
            // client.close();
        });
    }
}, update_dt_ms);