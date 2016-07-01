
// var t = "hello";

// var xo = ()=>{
// 	console.log('xxx:'+t);
// }

// xo();

// console.log("start");
var React = require('react')
var reactDom = require("react-dom");
var HI = require('./HI');


reactDom.render(<HI />,
	document.getElementById('container'));

