var rollup = require('rollup');
var aliasFile = "./rollup-plugin-alias.js";
var alias = require(aliasFile);

rollup.rollup({
    entry: './files/index.js',
    plugins: [alias({
        fancyNumber: './aliasMe',
        './anotherFancyNumber': './localAliasMe',
        numberFolder: './folder',
        './numberFolder': './folder',
    })]
}).then(stats => {
    
    stats.write({
        format: 'cjs',
        dest: 'dist/alias_test.js'
    });
    console.log('out',stats.modules.length);
    console.log(stats.modules[0].id);
    console.log(stats.modules[1].id);
    console.log(stats.modules[2].id);
    console.log(stats.modules[3].id);
    console.log(stats.modules[4].id);
    // t.is(stats.modules[0].id.endsWith('/files/nonAliased.js'), true);
    // t.is(stats.modules[1].id.endsWith('/files/aliasMe.js'), true);
    // t.is(stats.modules[2].id.endsWith('/files/localAliasMe.js'), true);
    // t.is(stats.modules[3].id.endsWith('/files/folder/anotherNumber.js'), true);
    // t.is(stats.modules[4].id.endsWith('/files/index.js'), true);
    // t.is(stats.modules.length, 5);
}, error => {
    console.log(error);
})