/*
*@description 图层
*
**/

var Layer = funciton(){}

Layer.prototype = {
    getCurPath:function(){
        return this.paths[0];
    },
    paths:[],//图层内的图形
    draw:function(){
        
    }
};


module.exports = Layer;