
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
    this.draw=function(isRetina) {
        for (var p in this.paths) {
            //计算图形是否展示
            //坐标转换到显示区坐标 
            var path = this.paths[p];
            path.isRetina = isRetina;
            path.mapCoords(zoom.genReTransCoord());   
            path.draw();
        }
    };
};

Layer.prototype.hitTest = function(x,y){
    var isFind =0;
    for (var p in this.paths) {
        var path = this.paths[p];
        path.clearLight();
        if(!isFind){
            if( path.hitTest(x,y)){
                //高亮50ms
                path.setLight();
                isFind = 1;    
            }
        }
    }
};

module.exports = Layer;

