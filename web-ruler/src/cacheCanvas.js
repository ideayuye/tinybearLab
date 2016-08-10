
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

cacheCanvas.setBox = function(ww,wh,isRetina){
    this.canvas.setAttribute('width', ww);
    this.canvas.setAttribute('height', wh);
    if(isRetina){
        this.canvas.style.width = Math.round(ww*0.5)+"px";
        this.canvas.style.height = Math.round(wh*0.5)+"px";
    }else{
        this.canvas.style.width = ww+"px";
        this.canvas.style.height = wh+"px";
    }
}


module.exports = cacheCanvas;

