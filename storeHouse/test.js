var http = require('http');
var querystring = require('querystring');
var Buffer = require('buffer').Buffer;

var postData = querystring.stringify({
    'msg': 'Hello World!'
});

var req = http.request({
    host: '127.0.0.1',
    port: 801,
    method: 'POST',
    path: '/post?callback=belll',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
    }
}, (res) => {
    var body = "";
    res.on('data', (d) => {
        body += d;
    })
    res.on('end', () => {
        console.log(body);
    })
})

req.write(postData);

req.end();