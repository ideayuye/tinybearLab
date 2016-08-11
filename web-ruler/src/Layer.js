
/*
*@description 图层
**/

var zoom = require('./zoom.js');

var Layer = function(){
    this.paths={};
    this.addPath=function(p){
        this.paths[p.id] = p;
    };
    this.remove=function(id){
        delete this.paths[id];
    };
    this.draw=function() {
        for (var p in this.paths) {
            //计算图形是否展示
            //坐标转换到显示区坐标 
            this.paths[p].mapCoords(zoom.genReTransCoord());   
            this.paths[p].draw();
        }
    };
};

module.exports = Layer;

