
var vm = require('vm');

var stores = [];

var runCode = ()=>{
    var sandbox = {
            na:'1',
            name:"bradley"
        }

    // vm.runInNewContext('var name = "bradley"',sandbox);
    stores.push(sandbox);
}


for (var index = 0; index < 50000; index++) {
    runCode();
}

console.log('end');
