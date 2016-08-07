
/*
*@description 离屏幕绘图 canvas
*/

var cacheCanvas = {
    canvas:null,
    context:null
};

cacheCanvas.init = function(){
    this.canvas  = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
};

cacheCanvas.setBox = function(ww,wh){
    this.canvas.setAttribute('width', ww);
    this.canvas.setAttribute('height', wh);
}


module.exports = cacheCanvas;

