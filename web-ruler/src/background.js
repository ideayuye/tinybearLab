
/*
*背景图操作类
*/

var bg = {
    ctx:null,
    //背景图
    background:null,
    dpr:1
};

bg.init = function(ctx){
    this.ctx = ctx;
};

bg.setBG = function (screenShot) {
    var image = new Image();
    image.src = screenShot;
    this.background = image;
    this.dpr = window.devicePixelRatio;
}

//背景图
bg.drawBG = function(){
    var _ = this;
    var ctx = _.ctx;
    if(_.background){
        ctx.drawImage(_.background,0,0,
        _.background.width/_.dpr,
        _.background.height/_.dpr);
    }
};

module.exports = bg;

