'use strict'
// var koa = require('koa');

// var app = koa();

// console.log(app.callback);


// function Application() {
//   if (!(this instanceof Application)) return new Application;
//   this.env = 'test';
// }

// var t = new Application;

// console.log(t);

var EventEmitter = require('events');

// var ee = new EventEmitter;

// ee.on('test',()=>{
//     console.log('test emitter');
// });

// // ee.on('error',()=>{console.log('error');})

// process.on('uncaughtException', (err) => {
//   console.log('whoops! there was an error');
// });

// ee.emit('test');

// ee.emit('error');

const util = require('util');

function MyEmitter() {
  EventEmitter.call(this);
}
// util.inherits(MyEmitter, EventEmitter);

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
myEmitter.emit('event');




