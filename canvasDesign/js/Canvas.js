
var Layer = require('./Layer');

var Canvas = function(){
    this.tempLayer = new Layer();
    this.layers    = [];
    this.curLayer = function(){
        return this.layers[0];
    }
};

module.exports = Canvas;
