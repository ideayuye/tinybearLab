
console.log('hello start');

const immutable = require('immutable');

let o = immutable.fromJS({a:1,b:2,c:{hx:22}});
console.log(o);
console.log(o.get('a'));
// o.map(e=>{return e.get('a');})

console.log('hello end');
