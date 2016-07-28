
var Line = require('./line');

var dw = {};

var ww = window.innerWidth;
var wh = document.body.clientHeight;
var canvas = null;

dw.action = 1;
dw.curPath = null;
dw.lines = [];

dw.init = function() {
    canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'ruler-panel');
    canvas.setAttribute('width', ww);
    canvas.setAttribute('height', wh);
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');

    this.bindDraw();
    animate();
};

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
    canvas.addEventListener('mousedown',function(e){
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
};

dw.process = function (data) {
    //根据action判断当前图形 图形的绘制进展
    switch (data.action) {
        case 1:
            if (!this.curPath && data.mouseType == "mousedown") {
                this.curPath = new Line(ctx);
            }
            if (this.curPath) {
                this.curPath.process(data);
                if (this.curPath.isEnd()) {
                    dw.lines.push(this.curPath);
                    this.curPath = null;
                }
            }
            break;
        default:
            break;
    }
};

dw.draw = function() {
    this.lines.forEach(x=>{
        x.draw();
    });
};

var animate = function () {
    //重绘页面
    this.ctx.clearRect(0, 0, ww, wh);
    dw.draw();
    window.requestAnimationFrame(animate);
};

module.exports = dw;


