

var a = require('./js/a');

require('./css/index.css');

a();
console.log('hello world');
document.getElementById("container").innerHTML = "<p>hello world</p>";

//tmpl_container

var template = require("./template/tp.html");
var data={say_hello:"it is handlebars"};
var html = template(data);
document.getElementById('tmpl_container').innerHTML = html;

