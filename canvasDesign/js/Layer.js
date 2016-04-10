/*
*@description 图层
*
**/

var Layer = function(){
};

Layer.prototype = {
    paths:[],//图层内的图形
    draw:function(){
        this.paths.forEach(function(p){
            p.draw();
        });
    }
};

module.exports = Layer;

