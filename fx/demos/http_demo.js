
var http = require('http');


var server = http.createServer((req, res) => {
    res.end('hello world');
});

server.listen(1202, '127.0.0.1');

console.log('server start:1202');



