
var rollup = require('rollup');
var alias = require('rollup-plugin-alias');
var path = require('path');

// var aliasFile = "./rollup-plugin-alias.js";
// var alias = require( aliasFile);

rollup.rollup({
    entry: 'main.js',
    plugins: [
        alias({
            libs: path.resolve(__dirname, './libs')
        })
    ]
}).then(function(bundle){
    bundle.write({
        format:'umd',
        dest: 'dist/bundle_api.js'
    });
    console.log('it build ok')
},function(error){
    console.log(error);
});

