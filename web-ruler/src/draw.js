
var Line = require('./line.js');

var dw = {};
dw.lines = [];
dw.action = 1;
dw.curPath = null;

/*var ww = window.innerWidth;
var wh = document.body.clientHeight;*/
var ww = 500;
var wh = 500;
var ctx = null;
var canvas = null;

dw.init = function () {
    canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'ruler-panel');
    canvas.setAttribute('width', ww);
    canvas.setAttribute('height', wh);
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');

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
    switch(data.action){
        case 1:
            if(!this.curPath && data.mouseType=="mousedown") {
                this.curPath = new Line(ctx);
            }
            if(this.curPath) {
                this.curPath.process(data);
                if (this.curPath.isEnd()) {
                    var id = this.curPath.id;
                    this.lines.push(this.curPath);
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
    dw.lines.forEach(x=>{x.draw();});
    window.requestAnimationFrame(animate);
};

module.exports = dw;

