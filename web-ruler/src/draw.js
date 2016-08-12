
var zoom = require('./zoom.js');
var process = require('./reducers/combineReducers.js');
var CommomCanvas = require('./libs/CommonCanvas.js');
var cacheCvs = require('./cacheCanvas.js');
var createStore = require('redux').createStore;
var map = require('./map.js');
var os = require('./detectOS')(),
    isMac = os === "Mac",
    dpr = window.devicePixelRatio,
    isRetina = isMac && dpr == 2,
    vCanvas = null,
    bCanvas = null,
    store = null;

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
    draw: {
        curPath: null,
        isUpdate: false,
    },
    control: {
        isPan: 0,
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        mx: 0,//水平平移量
        my: 0,//垂直平一量
        isUpdate:false
    }
}

var vCanvas = null,
    bCanvas = null,
    store = null;

/*初始化mark面板*/
dw.init = function () {
    vCanvas = new CommomCanvas();
    bCanvas = new CommomCanvas();

    vCanvas.canvas.setAttribute('id', 'ruler-panel');
    document.body.appendChild(vCanvas.canvas);

    map.cacheCtx = bCanvas.context;
    map.viewCtx = vCanvas.context;
    /*测试*/
    // document.body.appendChild(cacheCvs.canvas);
    // cacheCvs.canvas.setAttribute('id', 'ruler-panel');
    /*测试*/
    this.bindStore();
    this.bindDraw();
    animate();
}

/*设置截取的背景图*/
dw.setScreenShotUrl = function (screenShot) {
    var image = new Image();
        image.src = screenShot;
    var imgW = image.width,
        imgH = image.height;
    bCanvas.setBox(imgW, imgH,isRetina);
    vCanvas.setBox(imgW, imgH,isRetina);
    zoom.init(imgW, imgH,isRetina);
    zoom.setCenter(imgW, imgH);

    store.dispatch({ type: 'setbackground', screenShot: screenShot });
}

/*绑定绘制动作*/
dw.bindDraw = function () {
    var that = this;
    var wrapperData = function (type, e) {
        var ne = zoom.transCoord(e.x, e.y);
        return {
            mouseType: type,
            ox: e.x,
            oy: e.y,
            x: ne.x,
            y: ne.y,
            action: that.action
        };
    };
    var canvas = vCanvas.canvas;
    canvas.addEventListener('mousedown', function (e) {
        var data = wrapperData('mousedown', e);
        store.dispatch({ type: data.action + "_" + data.mouseType, data: data });
    });
    canvas.addEventListener('mouseup', function (e) {
        var data = wrapperData('mouseup', e);
        store.dispatch({ type: data.action + "_" + data.mouseType, data: data });
    });
    canvas.addEventListener('mousemove', function (e) {
        var data = wrapperData('mousemove', e);
        store.dispatch({ type: data.action + "_" + data.mouseType, data: data });
    });
};

dw.bindStore = function () {
    store = createStore(process, initState);
    store.subscribe(function () {
        // 需要时刷新图形
        var state = store.getState();
        draw = state && state.draw;
        if (draw && draw.isUpdate) {
            dw.drawCache();
            draw.isUpdate = false;
        }
    });
    store.subscribe(function(){
        var state = store.getState();
        control = state && state.control;
        if (control && control.isUpdate) {
            zoom.calViewBox();
            //计算坐标
            control.isUpdate = false;
        }
    });
};

dw.zoomIn = function(){
    store.dispatch({ type: 'zoom_in'});
};

dw.zoomOut = function(){
    store.dispatch({type: 'zoom_out'});
};

/*背景绘制*/
dw.drawCache = function () {
    bCanvas.context.clearRect(0, 0, bCanvas.ww,bCanvas.wh);
    map.bg.drawBG();
};

/*启动动画*/
var animate = function () {
    var box = zoom.viewBox;
    var ctx = vCanvas.context;
    if(box){
        ctx.clearRect(0, 0, vCanvas.ww,vCanvas.wh);
        ctx.drawImage(bCanvas.canvas, box.sx, box.sy, box.sw, box.sh, box.dx, box.dy, box.dw, box.dh);
        map.curLayer.draw(isRetina);
        map.tempLayer.draw(isRetina);
    }
    window.requestAnimationFrame(animate);
};

module.exports = dw;


