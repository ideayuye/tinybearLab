
var http = require('http');

var server =  http.createServer((req,res)=>{
    
    console.log('sever start'); 
    res.writeHead(200,{"Content-Type": "text/plain"});
    res.write("hello");
    res.end();
    
}).listen(1111);


