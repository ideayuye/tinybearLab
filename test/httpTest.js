
//var http = require('http');
//
//var server =  http.createServer((req,res)=>{
//
//    console.log('sever start');
//    res.writeHead(200,{"Content-Type": "text/plain"});
//    res.write("hello");
//    res.end();
//
//
//}).listen(1111);
//
//console.log('start 1111');

var express = require('express');
var app = express();

app.use('/',(req,res)=>{
    console.log(res.getHeader('Set-Cookie'));
    res.end('cookie parse');
});

app.listen('1111');
console.log('start 1111');





