
var Layer = require('./Layer');

var Canvas = function(ctx,w,h){
    this.ctx = ctx;
    this.width = w;
    this.height = h;
    this.tempLayer = new Layer();
    this.layers    = [];
    this.draw =function(){
        this.ctx.clearRect(0,0,w,h);
        this.tempLayer.draw();
    };
};

module.exports = Canvas;
