
var heapdump = require('heapdump');

var s = ()=>{
    var t = "hello";
    return ()=>{
        return t;
    }
}

s();

var http = require('http');

var server = http.createServer((req,res)=>{
    var file = 'tmp/myapp-' + process.pid + '-' + Date.now() + '.heapsnapshot';
    heapdump.writeSnapshot(file, function(err){
        if (err) console.error(err);
        else console.error('Wrote snapshot: ' + file);
    });
    
    res.end('hello end');
});
server.listen(1378);
console.log('listen');



