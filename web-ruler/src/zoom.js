
/*
根据缩放的等级 计算可视区域
*/

var zoom = {
    /*等级从1到10，1是1：1的*/
    level:1,
    /*中心点*/
    center:{x:0,y:0},
    ww:0,
    wh:0
};

zoom.init = function (ww,wh) {
    var _ = this;
    _.center.x = ww*0.5;
    _.center.y = wh*0.5;
    _.ww = ww;
    _.wh = wh;
};

/*
计算可视区域
*/
zoom.calViewBox = function () {
    var _ = this;
    var box = {
        sx:0,
        sy:0,
        sw:0,
        sh:0
    }

    box.sw =  _.ww/_.level;
    box.sx = _.center.x -  box.sw*0.5;
    box.sh = _.wh/_.level;
    box.sy = _.center.y - box.sh*0.5;

    return  box;
};

/*放大*/
zoom.zoomIn = function(){
    if(this.level<10)
        this.level ++;
};

/*缩小*/
zoom.zoomOut = function(){
    if(this.level > 1)
        this.level--;
}

/*平移*/
zoom.move = function(mx,my){
    this.center.x += mx;
    this.center.y += my;
};

module.exports = zoom;

