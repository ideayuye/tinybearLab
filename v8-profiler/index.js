
var test = function(){
    var t1 = Date.now();
    var s = '11';
    var i = 1;
    var h = 0;
    while(i<10000){
        s+='nixa';
        h = (h+1)*i;
        console.log('hi');
        i++;
    }
    var t2 = Date.now();
    console.log(t2-t1);
}


var fs = require('fs');
var profiler = require('v8-profiler');
profiler.startProfiling('1', true);
test();
var profile1 = profiler.stopProfiling();

console.log(profile1.getHeader());

profile1.export(function(error, result) {
  fs.writeFileSync('profile1.cpuprofile', result);
  profile1.delete();
});