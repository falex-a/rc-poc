/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=UTF-8'
    });
    //res.send('<h1>Hello from GROOO!!</h1>');
    //res.end('<script src="http://jeromeetienne.github.io/virtualjoystick.js/virtualjoystick.js"></script>');
    res.end('groo groo <script src="virtualjoystick.js"></script>');
    
}).listen(9080, "");

var express = require('express');
var app = express();
//app.get('/', function(req, res) {
//  res.send('Hello Seattle\n');
//});
//app.get('/musician/:name', function(req, res) {
//   // Get /musician/Matt
//   console.log(req.params.name);
//   // => Matt
//   res.send('{"id": 1,"name":"Matt","band":"BBQ Brawlers"}');
//});
//app.get('/joy', function(req, res) {
//   res.sendfile('joy.html');
//});
var path = require('path');
app.use(express.static(path.join(__dirname, 'html')));

app.get('/xy', function(req, res) {
   console.log('x,y: '+req.query.x+','+req.query.y);
   res.send('OK');
});

app.listen(3001);
console.log('Listening on port 3001...');
