var events = require('events')

console.log(events);

console.log(events.EventEmitter);

var ev = new events();
ev.on('e1',d=>{console.log('emit',d)});
ev.emit('e1',{say:'hi'});


