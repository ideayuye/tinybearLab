
var cluster = require('cluster');
var http = require('http');
var cupNum = require('os').cpus().length;

if(cluster.isMaster){
    for (var index = 0; index < cupNum; index++) {
        cluster.fork();
    }

    cluster.on('online',(worker)=>{
        console.log(`${worker.id} online,pid:${worker.process.pid}`);
    });

    cluster.on('exit',(worker,code,signal)=>{
        console.log(`pid: ${worker.pid} died`);
    });
}else{
    http.createServer((req,res)=>{
        console.log("work:"+process.pid);
        res.end('tb:hi');
    }).listen(1202);
}



