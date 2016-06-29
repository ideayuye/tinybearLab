
var t = "hello";

var xo = ()=>{
	console.log('xxx:'+t);
}

xo();

var react = require('react');
var reactDom = require("react-dom");


reactDom.render(
	<div>
	hello
	</div>,
	document.getElementById('container'));

