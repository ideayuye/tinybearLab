
var Layer = require('./Layer.js');
var bg = require('./background.js');
var zoom = require('./zoom.js');
var process = require('./reducers/process.js');
var cacheCvs = require('./cacheCanvas.js');
var createStore = require('redux').createStore;

var dw = {
    /*
        当前绘制动作
        动作说明：
        1－绘制标注线
        2－平移图片
    */
    action: 1
};

/*初始state*/
var initState = {
    curPath: null,
    isUpdate: false, 
    tempLayer: new Layer(),
    curLayer: new Layer(),
    cacheCtx:null,
}

var ww = 500,
    wh = 500,
    ctx = null,
    canvas = null,
    store = null;

/*初始化mark面板*/
dw.init = function () {
    canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'ruler-panel');
    document.body.appendChild(canvas);
    ww = canvas.offsetWidth;
    wh = canvas.offsetHeight;
    canvas.setAttribute('width', ww);
    canvas.setAttribute('height', wh);
    ctx = canvas.getContext('2d');
    cacheCvs.init(ww, wh);
    initState.cacheCtx = cacheCvs.context;
    this.bindStore();

    cacheCvs.context.strokeStyle = "red";

    bg.init(cacheCvs.context);
    zoom.init(ww, wh);
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
        store.dispatch({ type: "1_mousedown", data: data });
    });
    canvas.addEventListener('mouseup', function (e) {
        var data = wrapperData('mouseup', e);
        store.dispatch({ type: "1_mouseend", data: data });
    });
    canvas.addEventListener('mousemove', function (e) {
        var data = wrapperData('mousemove', e);
        store.dispatch({ type: "1_mouseend", data: data });
    });
}

dw.bindStore = function(){
    store = createStore(process,initState);
    store.subscribe(function () {
        // 需要时刷新图形
        var state = store.getState();
        if (state && state.isUpdate) {
            dw.drawCache(state);
            state.isUpdate = false;
        }
    });
}

//离屏绘制
dw.drawCache = function (state) {
    cacheCvs.context.clearRect(0, 0, ww, wh);
    bg.drawBG();
    state.curLayer.draw();
    state.tempLayer.draw();
};

/*启动动画*/
var animate = function () {
    var box = zoom.calViewBox();
    ctx.drawImage(cacheCvs.canvas, box.sx, box.sy, box.sw, box.sh, 0, 0, ww, wh);
    window.requestAnimationFrame(animate);
};

module.exports = dw;


