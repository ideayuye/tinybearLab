
/*
根据缩放的等级 计算可视区域
*/

var zoom = {
    /*等级从1到10，1是1：1的*/
    level:1,
    /*中心点*/
    center:{x:0,y:0},
    //显示屏宽高
    ww:0,
    wh:0,
    //全景宽高
    mw:0,
    mh:0,
    isRetina:false
};

zoom.init = function (ww,wh,isRetina) {
    var _ = this;
    _.center.x = ww*0.5;
    _.center.y = wh*0.5;
    _.ww = ww;
    _.wh = wh;
    _.isRetina = isRetina;
};

/*
设置中心点
 */
zoom.setCenter=function(mw,mh){
    var _ = this;
    this.mw = mw;
    this.mh = mh;
    this.center.x = mw*0.5;
    this.center.y = mh*0.5;
    // this.wh = Math.round(_.ww * mh/mw);
};

/*
计算可视区域 转化可视区域到
*/
zoom.calViewBox = function () {
    var _ = this;
    var box = {
        sx:0,
        sy:0,
        sw:0,
        sh:0,
        dx:0,
        dy:0,
        dw:_.ww,
        dh:_.wh
    }

    box.sw = _.ww/_.level;
    box.sx = _.center.x -  box.sw*0.5;
    box.sh = _.wh/_.level;
    box.sy = _.center.y - box.sh*0.5;

    if(box.sx < 0 ){
        box.dx = -box.sx;
        box.sx = 0;
    }

    if(box.sy < 0){
        box.dy = -box.sy;
        box.sy = 0;
    }

    return  box;
};

/*坐标变换*/
zoom.transCoord = function(x,y){
    // 更具中心点 缩放比例 计算新坐标位置
    var ncrd = {x:0,y:0};
    var _ = this;
    if(_.isRetina){
        x = 2*x;
        y = 2*y;
    }
    ncrd.x = x/_.level+(_.center.x-_.ww*.5/_.level);
    ncrd.y = y/_.level+(_.center.y-_.wh*.5/_.level);
    return ncrd;
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
    this.center.x += mx/this.level;
    this.center.y += my/this.level;
};

module.exports = zoom; 

