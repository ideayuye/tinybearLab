
var Layer = require('./Layer');

var Canvas = function(){
    this.tempLayer = new Layer();
    this.layers    = [];
};

module.exports = Canvas;
