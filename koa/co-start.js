
var co = require('co');

//co(function* () {
//  var result = yield Promise.resolve(true);
//  return result;
//}).then(function (value) {
//  console.log(value);
//}, function (err) {
//  console.error(err.stack);
//});

//function* gt(){
//    yield 1;
//    return "xo";
//}
//
//var g = gt();
//console.log(g.next());
//console.log(g.next());

var thunkify = require('thunkify');

var readx = function(cb){
    console.log('xtpl');
    cb(null,'test');
};

var readxt = thunkify(readx);

var pfn1 = function(t){
    return function(cb){
        cb(null,"hi"+t);
    }
};

co(function*(){
    console.log("go:");
    var a = yield pfn1('x1');
    console.log(a);
    var b = yield pfn1('x2');
    console.log(b);
    console.log("game over");
});




