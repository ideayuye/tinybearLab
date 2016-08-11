

var zoom = require('./zoom.js');
var process = require('./reducers/combineReducers.js');
var cacheCvs = require('./cacheCanvas.js');
var createStore = require('redux').createStore;
var map = require('./map.js');
var os = require('./detectOS')(),
    isMac = os === "Mac",
    dpr = window.devicePixelRatio,
    isRetina = isMac && dpr == 2;

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
    ctx = canvas.getContext('2d');

    cacheCvs.init();
    map.cacheCtx = cacheCvs.context;
    map.viewCtx = ctx;
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
    cacheCvs.setBox(imgW, imgH,isRetina);
    zoom.setCenter(imgW, imgH);

    ww = window.innerWidth;
    wh = window.innerHeight;
    canvas.setAttribute('width', imgW);
    canvas.setAttribute('height', imgH);
    zoom.init(imgW, imgH,isRetina);
    if(isRetina){
        ww = imgW;
        wh = imgH;
        canvas.style.width = Math.round(ww*0.5)+"px";
        canvas.style.height = Math.round(wh*0.5)+"px";
    }else{
        canvas.style.width = ww + "px";
        canvas.style.height = wh + "px";
    }

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

/*离屏绘制*/
dw.drawCache = function () {
    cacheCvs.context.clearRect(0, 0, ww, wh);
    map.refresh();
};

/*启动动画*/
var animate = function () {
    var box = zoom.viewBox;
    if(box){
        ctx.clearRect(0, 0, ww, wh);
        ctx.drawImage(cacheCvs.canvas, box.sx, box.sy, box.sw, box.sh, box.dx, box.dy, box.dw, wh);
    }
    window.requestAnimationFrame(animate);
};

module.exports = dw;


