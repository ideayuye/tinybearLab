/*
*@description 图层
*
**/

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
            this.paths[p].draw();
        }
    };
};

module.exports = Layer;

