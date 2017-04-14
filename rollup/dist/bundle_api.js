(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

function hello(){
    console.log('it is m1');
}

hello();

function hi(){
    console.log('hi');
}

hello();
hi();

var os = require('os');
console.log(os.platform());
console.log('iswin',os.platform() === "win32");

var path = require('path');
console.log(path.dirname('/src'));
console.log(path.resolve('/','/'));
console.log(path.parse(path.dirname('/src')).root);

console.log('main ok');

})));
