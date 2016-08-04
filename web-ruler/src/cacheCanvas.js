
/*
*@description 离屏幕绘图 canvas
*/

var cacheCanvas = {
    canvas:null,
    context:null
};


cacheCanvas.init = function(ww,wh){
    this.canvas  = document.createElement('canvas');
    this.canvas.setAttribute('width', ww);
    this.canvas.setAttribute('height', wh);
    this.context = this.canvas.getContext('2d');
};



module.exports = cacheCanvas;

