
import hello from "libs/m1"
import hi from "libs/m2"

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
