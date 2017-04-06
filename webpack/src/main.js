

var a = require('./js/a');
var common = require('./js/common');
// require('./css/index.css');

common();
a();
console.log('hello world');
// document.getElementById("container").innerHTML = "<p>hello world</p>";


//  var template = require("./template/tp.html");
//  var data={say_hello:"it is handlebars"};
//  var html = template(data);
//  document.getElementById('tmpl_container').innerHTML = html;


var cp = function(resolve){
     require.ensure(['./js/codeSplit.js'],function(){
        resolve(require('./js/codeSplit.js'));
    });
}

var getModule = function(){
    return new Promise((resolve,require)=>{
        cp(resolve);
    });
}

getModule().then((cl)=>{
    console.log(cl.name);
});

var re = require('react');