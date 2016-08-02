
var Line = require('./line.js');
var Layer = require('./Layer.js');
var LengthMark = require('./lengthMark.js');
var bg = require('./background.js');
var zoom = require('./zoom.js');

var dw = {
    /*动作说明：
        1－绘制标注线
        2－平移图片
    */
    action: 1,//当前绘制动作
    curPath: null,
    tempLayer: new Layer(),
    curLayer: new Layer()
};

var ww = 500,
    wh = 500,
    ctx = null,
    canvas = null,
    cacheCtx = null,
    cacheCanvas = null;

/*初始化mark面板*/
dw.init = function () {
    canvas = document.createElement('canvas');
    cacheCanvas = document.createElement('canvas');
    canvas.setAttribute('id', 'ruler-panel');
    document.body.appendChild(canvas);
    ww = canvas.offsetWidth;
    wh = canvas.offsetHeight;
    canvas.setAttribute('width', ww);
    canvas.setAttribute('height', wh);
    cacheCanvas.setAttribute('width', ww);
    cacheCanvas.setAttribute('height', wh);
    ctx = canvas.getContext('2d');
    cacheCtx = cacheCanvas.getContext('2d');

    cacheCtx.strokeStyle = "red";

    bg.init(cacheCtx);
    zoom.init(ww,wh);
    this.bindDraw();
    animate();
}

/*设置截取的背景图*/ 
dw.setScreenShotUrl = function (screenShot) {
    bg.setBG(screenShot);
}

/*绑定绘制动作*/
dw.bindDraw = function () {
    var that = this;
    var wrapperData = function (type, e) {
        return {
            mouseType: type,
            x: e.x,
            y: e.y,
            action: that.action
        };
    };
    canvas.addEventListener('mousedown', function (e) {
        var data = wrapperData('mousedown', e);
        that.process(data);
    });
    canvas.addEventListener('mouseup', function (e) {
        var data = wrapperData('mouseup', e);
        that.process(data);
    });
    canvas.addEventListener('mousemove', function (e) {
        var data = wrapperData('mousemove', e);
        that.process(data);
    });

}
/*处理绘制动作*/
dw.process = function (data) {
    //根据action判断当前图形 图形的绘制进展
    switch (data.action) {
        case 1:
            if (!this.curPath && data.mouseType == "mousedown") {
                // this.curPath = new Line(ctx);
                this.curPath = new LengthMark(cacheCtx);
                this.tempLayer.addPath(this.curPath);
            }
            if (this.curPath) {
                this.curPath.process(data);
                if (this.curPath.isEnd()) {
                    var id = this.curPath.id;
                    this.tempLayer.remove(id);
                    this.curLayer.addPath(this.curPath);
                    this.curPath = null;
                }
            }
            break;
        case 2:
            //mousedown
            if(data.mouseType == "mousedown"){
                
            }
            //mousemove
            if(data.mouseType == "mousemove"){
                
            }
            //mouseup
            if(data.mouseType == "mouseup"){
                
            }
            break;
        default:
            break;
    }
}

//离屏绘制
dw.drawCache = function () {
    cacheCtx.clearRect(0, 0, ww, wh);
    bg.drawBG();
    dw.curLayer.draw();
    dw.tempLayer.draw();
};


var animate = function () {
    dw.drawCache();
    var box = zoom.calViewBox();
    ctx.drawImage(cacheCanvas,box.sx,box.sy,box.sw,box.sh,0,0,ww,wh);
    window.requestAnimationFrame(animate);
};

module.exports = dw;


