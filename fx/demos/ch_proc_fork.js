
var child_p = require('child_process');
 
var cp = child_p.fork('./hello.js');

// cp.stdout.on('data',(data)=>{
//     console.log(data.toString());
// });

// cp.stderr.on('data',(data)=>{
//     console.log(data.toString());
// });

cp.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});