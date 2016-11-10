

var h1 = require('./hot1');

h1();

if(module.hot){
    module.hot.accept('./hot1',function(){
        h1 = require('./hot1');
        h1();
    });
}


module.exports = function(){
    console.log('h2');
}
