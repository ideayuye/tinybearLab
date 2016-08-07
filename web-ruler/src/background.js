
/*
*背景图操作类
*/

var bg = {
    ctx:null,
    //背景图
    background:null,

};

bg.init = function(ctx){
    this.ctx = ctx;
};

bg.setBG = function (screenShot) {
    var image = new Image();
    image.src = screenShot;
    this.background = image;;
}

//背景图
bg.drawBG = function(){
    var _ = this;
    var ctx = _.ctx;
    if(_.background){
        ctx.drawImage(_.background,0,0,
        _.background.width,
        _.background.height);
    }
};

module.exports = bg;

