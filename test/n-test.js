
const v8 = require('v8');

// console.log(v8.getHeapStatistics());

const util = require('util');
const vm = require('vm');
var sandbox = {
    animal:'dog',
    count:3
};

var context  = new vm.createContext(sandbox);
var script = new vm.Script('count += 1;name="kitty"');

for(var i=0;i<10;++i){
    script.runInContext(context);
}

console.log(util.inspect(sandbox));

const fs = require('fs');
var rr = fs.createReadStream('bigData.txt');
rr.setEncoding('utf-8');
// rr.setEncoding('hex');
rr.on('readable',()=>{
    console.log('readable',rr.read());
});

rr.on('end',()=>{
    console.log('end');
});


process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    process.stdout.write(`data: ${chunk}`);
  }
});

process.stdin.on('end', () => {
  process.stdout.write('end');
});

const spawn = require('child_process').spawn;

const bat = spawn('cmd.exe',['/c','my.bat']);

bat.stdout.on('data',(data)=>{
    console.log(data);
});


var m1 = require('./module');
console.log(require.resolve('module'));





