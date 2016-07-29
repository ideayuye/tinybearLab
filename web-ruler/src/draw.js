
var Line = require('./line.js');
var Layer = require('./Layer.js');

var dw = {
    action: 1,
    curPath: null,
    tempLayer: new Layer(),
    curLayer: new Layer()
};

var ww = 500;
var wh = 500;
var ctx = null;
var canvas = null;

dw.init = function () {
    canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'ruler-panel');
    document.body.appendChild(canvas);
    ww = canvas.offsetWidth;
    wh = canvas.offsetHeight;
    canvas.setAttribute('width', ww);
    canvas.setAttribute('height', wh);
    ctx = canvas.getContext('2d');

    ctx.strokeStyle = "red";

    this.bindDraw();
    animate();
}

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

dw.process = function (data) {
    //根据action判断当前图形 图形的绘制进展
    switch (data.action) {
        case 1:
            if (!this.curPath && data.mouseType == "mousedown") {
                this.curPath = new Line(ctx);
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
        default:
            break;
    }
}

var animate = function () {
    //重绘页面
    ctx.clearRect(0, 0, ww, wh);
    dw.curLayer.draw();
    dw.tempLayer.draw();
    window.requestAnimationFrame(animate);
};

module.exports = dw;

