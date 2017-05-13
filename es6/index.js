function *t(){
    yield 'hi';
}

console.log('cafa');

var di = t();

console.log(di.next());


(()=>{
    console.log('cafa')
})()


//symbol
var sm = Symbol('b1');
var ob = {}
ob[sm]= 'it is symbol';
console.log(ob[sm]);


