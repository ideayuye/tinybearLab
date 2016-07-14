
var child_p = require('child_process');
var spawn = child_p.spawn;

var cp = spawn('echo',['hello']);

cp.stdout.on('data',(data)=>{
    console.log(data.toString());
});

cp.stderr.on('data',(data)=>{
    console.log('err:'+data.toString());
});

cp.on('close',(code)=>{
    console.log('child process exited with code ',code);
});


