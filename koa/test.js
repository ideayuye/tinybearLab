
//"use strict"
//function* tx(){
//   yield 1;
//   yield 2;
//   return 5;
//}
//for (let v of tx()) {
//  console.log(v);
//}


"use strict";

var tx = function () {

};

function* numbers () {
  var a = yield 1;
  console.log(a);
  var b = yield 2;
  console.log(b);
  return 3;
}

var n = numbers();
console.log(n.next());
console.log(n.next());
console.log(n.next());

//[...numbers()] // [1, 2]

//var t = Array.from(numbers()) // [1, 2]
//console.log(t);

//let [x, y] = numbers();
//x // 1
//y // 2

//for (let n of numbers()) {
//  console.log(n)
//}


function co(fn) {
  return function(done) {
    var ctx = this;
    var gen = fn.call(ctx);
    var it = null;
    function _next(err, res) {
      if(err) res = err;
      it = gen.next(res);
      //{value:function(){},done:false}
      if(!it.done){
        it.value(_next);
      }
    }
    _next();
  }
}

var fs = require('fs');
//thunk
function read(file) {
  return function(fn){
    fs.readFile(file, 'utf8', fn);
  }
}

//co(function *(){
//  var c = 2;
//  console.log(c);
//  var a = yield read('app.js');
//  console.log(a.length);
//
//  var b = yield read('co-start.js');
//  console.log(b.length);
//})();

