/*
*@description 图层基础类
*
**/

var Path = function(ctx){
    this.ctx = ctx;
    this.id = "p_" + (new Date()).valueOf();
    //四中类型 lineTo quadraticCurveTo bezierCurveTo arcTo
    this.segments = [];
    this.process = function(data){};
    this.draw = function(){};

};


module.exports = Path;