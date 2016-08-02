/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	eval("\r\n\r\nvar button = document.createElement('button');\r\nbutton.innerText = \"截图\";\r\ndocument.body.appendChild(button);\r\n\r\nvar draw = __webpack_require__(1);\r\ndraw.init();\r\n\r\nvar getScreenShot = function () {\r\n    chrome.runtime.sendMessage({ n: \"sall\" }, function (response) {\r\n        console.log(\"screen ok\");\r\n        // screenShotUrl = response;\r\n        draw.setScreenShotUrl(response);\r\n    });\r\n}\r\n\r\ngetScreenShot();\r\n\r\nbutton.addEventListener('click',getScreenShot);\r\n\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/main.js\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/main.js?");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	eval("\r\nvar Line = __webpack_require__(2);\r\nvar Layer = __webpack_require__(3);\r\nvar LengthMark = __webpack_require__(4);\r\nvar bg = __webpack_require__(5);\r\nvar zoom = __webpack_require__(6);\r\n\r\nvar dw = {\r\n    action: 1,//当前绘制动作\r\n    curPath: null,\r\n    tempLayer: new Layer(),\r\n    curLayer: new Layer()\r\n};\r\n\r\nvar ww = 500,\r\n    wh = 500,\r\n    ctx = null,\r\n    canvas = null,\r\n    cacheCtx = null,\r\n    cacheCanvas = null;\r\n\r\n/*初始化mark面板*/\r\ndw.init = function () {\r\n    canvas = document.createElement('canvas');\r\n    cacheCanvas = document.createElement('canvas');\r\n    canvas.setAttribute('id', 'ruler-panel');\r\n    document.body.appendChild(canvas);\r\n    ww = canvas.offsetWidth;\r\n    wh = canvas.offsetHeight;\r\n    canvas.setAttribute('width', ww);\r\n    canvas.setAttribute('height', wh);\r\n    cacheCanvas.setAttribute('width', ww);\r\n    cacheCanvas.setAttribute('height', wh);\r\n    ctx = canvas.getContext('2d');\r\n    cacheCtx = cacheCanvas.getContext('2d');\r\n\r\n    cacheCtx.strokeStyle = \"red\";\r\n\r\n    bg.init(cacheCtx);\r\n    zoom.init(ww,wh);\r\n    this.bindDraw();\r\n    animate();\r\n}\r\n\r\n/*设置截取的背景图*/ \r\ndw.setScreenShotUrl = function (screenShot) {\r\n    bg.setBG(screenShot);\r\n}\r\n\r\n/*绑定绘制动作*/\r\ndw.bindDraw = function () {\r\n    var that = this;\r\n    var wrapperData = function (type, e) {\r\n        return {\r\n            mouseType: type,\r\n            x: e.x,\r\n            y: e.y,\r\n            action: that.action\r\n        };\r\n    };\r\n    canvas.addEventListener('mousedown', function (e) {\r\n        var data = wrapperData('mousedown', e);\r\n        that.process(data);\r\n    });\r\n    canvas.addEventListener('mouseup', function (e) {\r\n        var data = wrapperData('mouseup', e);\r\n        that.process(data);\r\n    });\r\n    canvas.addEventListener('mousemove', function (e) {\r\n        var data = wrapperData('mousemove', e);\r\n        that.process(data);\r\n    });\r\n\r\n}\r\n/*处理绘制动作*/\r\ndw.process = function (data) {\r\n    //根据action判断当前图形 图形的绘制进展\r\n    switch (data.action) {\r\n        case 1:\r\n            if (!this.curPath && data.mouseType == \"mousedown\") {\r\n                // this.curPath = new Line(ctx);\r\n                this.curPath = new LengthMark(cacheCtx);\r\n                this.tempLayer.addPath(this.curPath);\r\n            }\r\n            if (this.curPath) {\r\n                this.curPath.process(data);\r\n                if (this.curPath.isEnd()) {\r\n                    var id = this.curPath.id;\r\n                    this.tempLayer.remove(id);\r\n                    this.curLayer.addPath(this.curPath);\r\n                    this.curPath = null;\r\n                }\r\n            }\r\n            break;\r\n        default:\r\n            break;\r\n    }\r\n}\r\n\r\n//离屏绘制\r\ndw.drawCache = function () {\r\n    cacheCtx.clearRect(0, 0, ww, wh);\r\n    bg.drawBG();\r\n    dw.curLayer.draw();\r\n    dw.tempLayer.draw();\r\n};\r\n\r\n//计算可视区域\r\n\r\n\r\nvar animate = function () {\r\n    dw.drawCache();\r\n    var box = zoom.calViewBox();\r\n    ctx.drawImage(cacheCanvas,box.sx,box.sy,box.sw,box.sh,0,0,ww,wh);\r\n    window.requestAnimationFrame(animate);\r\n};\r\n\r\nmodule.exports = dw;\r\n\r\n\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/draw.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/draw.js?");

/***/ },
/* 2 */
/***/ function(module, exports) {

	eval("\n/**\n * Created by tinybear on 2016/4/4.\n */\n\n\nvar Line = function(ctx){\n    this.ctx = ctx;\n    this.id = \"p_\" + (new Date()).valueOf();\n    this.p1={x:0,y:0,isOK:0};\n    this.p2={x:0,y:0,isOK:0};\n    this.setP1=function(x,y){\n        this.p1.x = x;\n        this.p1.y = y;\n        this.p1.isOK = 1;\n    };\n    this.setP2=function(x,y){\n        this.p2.x = x;\n        this.p2.y = y;\n        this.p2.isOK = 1;\n    };\n    this.step = 0;\n    this.isEnd = function(){\n        return this.step == 3? true:false;\n    };\n    this.process=function(data){\n        switch(data.mouseType){\n            case \"mousedown\":\n                if(this.step == 0) {\n                    this.setP1(data.x, data.y);\n                    this.step = 1;\n                }\n                break;\n            case \"mousemove\":\n                if(this.p1.isOK) {\n                    this.setP2(data.x, data.y);\n                    this.step = 2;\n                }\n                break;\n            case \"mouseup\":\n                if(this.step == 2) {\n                    this.setP2(data.x, data.y);\n                    this.step = 3;\n                }\n                break;\n        }\n    };\n    this.draw=function(){\n        //this.drawNode();\n        if(this.step < 2)\n            return;\n        this.ctx.beginPath();\n        this.ctx.moveTo(this.p1.x,this.p1.y);\n        this.ctx.lineTo(this.p2.x,this.p2.y);\n        this.ctx.stroke();\n        this.ctx.closePath();\n    };\n    //绘制节点\n    this.drawNode=function(){\n        this.ctx.fillStyle = \"#07a\";\n        if(this.p1.isOK){\n            this.ctx.fillRect(this.p1.x-2, this.p1.y-2, 4, 4);\n        }\n        if(this.p2.isOK){\n            this.ctx.fillRect(this.p2.x-2, this.p2.y-2, 4, 4);\n        }\n    };\n};\n\nmodule.exports = Line;\n\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/line.js\n ** module id = 2\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/line.js?");

/***/ },
/* 3 */
/***/ function(module, exports) {

	eval("\r\n/*\r\n*@description 图层\r\n**/\r\n\r\nvar Layer = function(){\r\n    this.paths={};\r\n    this.addPath=function(p){\r\n        this.paths[p.id] = p;\r\n    };\r\n    this.remove=function(id){\r\n        delete this.paths[id];\r\n    };\r\n    this.draw=function() {\r\n        for (var p in this.paths) {\r\n            this.paths[p].draw();\r\n        }\r\n    };\r\n};\r\n\r\nmodule.exports = Layer;\r\n\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/Layer.js\n ** module id = 3\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/Layer.js?");

/***/ },
/* 4 */
/***/ function(module, exports) {

	eval("\r\nvar LengthMark = function(ctx){\r\n    this.ctx = ctx;\r\n    this.id = \"lm_\" + (new Date()).valueOf();\r\n    this.p1={x:0,y:0,isOK:0};\r\n    this.p2={x:0,y:0,isOK:0};\r\n    this.dir = \"\";\r\n    this.setP1=function(x,y){\r\n        this.p1.x = x+0.5;\r\n        this.p1.y = y+0.5;\r\n        this.p1.isOK = 1;\r\n    };\r\n    this.setP2=function(x,y){\r\n        var dir = this.judgeDir(x,y);\r\n        this.dir = dir;\r\n        if(dir == \"v\"){\r\n            this.p2.x = this.p1.x;\r\n            this.p2.y = y+0.5;\r\n        }\r\n        if(dir == \"h\"){\r\n            this.p2.x = x+0.5;\r\n            this.p2.y = this.p1.y;\r\n        }\r\n        this.calMarkPos();\r\n        this.p2.isOK = 1;\r\n    };\r\n    this.step = 0;\r\n    this.isEnd = function(){\r\n        return this.step == 3? true:false;\r\n    };\r\n    this.dx = function(){\r\n        var dx = 0;\r\n        if(this.p1.isOK && this.p2.isOK){\r\n            dx = this.p1.x - this.p2.x;\r\n            dx = Math.abs(dx);\r\n        }\r\n        return dx;\r\n    };\r\n    this.dy = function(){\r\n        var dy = 0;\r\n        if(this.p1.isOK && this.p2.isOK){\r\n            dy = this.p1.y - this.p2.y;\r\n            dy = Math.abs(dy);\r\n        }\r\n        return dy;\r\n    };\r\n    this.markPos = {x:0,y:0};\r\n    //计算长度标记的位置\r\n    this.calMarkPos = function(){\r\n        var dir = this.dir;\r\n        var x,y;\r\n        if(dir == \"v\"){\r\n            x = this.p1.x;\r\n            y = Math.round((this.p1.y+this.p2.y)*0.5);\r\n        }\r\n        if(dir == \"h\"){\r\n            x = Math.round((this.p1.x+this.p2.x)*0.5);\r\n            y = this.p1.y;\r\n        }\r\n        this.markPos = {x:x,y:y};\r\n    };\r\n    //判断方向\r\n    this.judgeDir = function (x,y) {\r\n        if(this.p1.isOK){\r\n            var p1 = this.p1;\r\n            var dx = Math.abs(x-p1.x);\r\n            var dy = Math.abs(y-p1.y);\r\n            var tan = dy/dx;\r\n            if(tan>1)\r\n                return \"v\";\r\n            else\r\n                return \"h\";\r\n        }\r\n    };\r\n    this.process=function(data){\r\n        switch(data.mouseType){\r\n            case \"mousedown\":\r\n                if(this.step == 0) {\r\n                    this.setP1(data.x, data.y);\r\n                    this.step = 1;\r\n                }\r\n                break;\r\n            case \"mousemove\":\r\n                if(this.p1.isOK) {\r\n                    this.setP2(data.x, data.y);\r\n                    this.step = 2;\r\n                }\r\n                break;\r\n            case \"mouseup\":\r\n                if(this.step == 2) {\r\n                    this.setP2(data.x, data.y);\r\n                    this.step = 3;\r\n                }\r\n                break;\r\n        }\r\n    };\r\n    this.draw=function(){\r\n        if(this.step < 2)\r\n            return;\r\n        this.ctx.stokeStyle = '#FE1616';\r\n        this.ctx.beginPath();\r\n        this.ctx.lineWidth = 1;\r\n        this.ctx.moveTo(this.p1.x,this.p1.y);\r\n        this.ctx.lineTo(this.p2.x,this.p2.y);\r\n        this.ctx.stroke();\r\n        this.ctx.closePath();\r\n        this.drawMark();\r\n        this.drawNode();\r\n        if(this.step == 2){\r\n            this.drawDottedLine();\r\n        }\r\n    };\r\n    //绘制节点\r\n    this.drawNode=function(){\r\n        this.ctx.beginPath();\r\n        if(this.dir == \"v\"){\r\n            this.ctx.moveTo(this.p1.x-5,this.p1.y);\r\n            this.ctx.lineTo(this.p1.x+5,this.p1.y);\r\n            this.ctx.moveTo(this.p2.x-5,this.p2.y);\r\n            this.ctx.lineTo(this.p2.x+5,this.p2.y);\r\n        }\r\n        if(this.dir == \"h\"){\r\n            this.ctx.moveTo(this.p1.x,this.p1.y-5);\r\n            this.ctx.lineTo(this.p1.x,this.p1.y+5);\r\n            this.ctx.moveTo(this.p2.x,this.p2.y-5);\r\n            this.ctx.lineTo(this.p2.x,this.p2.y+5);\r\n        }\r\n        this.ctx.stroke();\r\n        this.ctx.closePath();\r\n    };\r\n    //绘制标注\r\n    this.drawMark = function(){\r\n        var length = \"\";\r\n        if(this.dir == \"v\"){\r\n            length = this.dy();\r\n        }\r\n        if(this.dir == \"h\"){\r\n            length = this.dx();\r\n        }\r\n        this.ctx.font = \"16px arial\";\r\n        var mtxt = this.ctx.measureText(length);\r\n        var mx = 0,my = 0;\r\n        if(this.dir == \"v\"){\r\n            mx = this.markPos.x-mtxt.width*0.5;\r\n            my = this.markPos.y+6;\r\n        }\r\n        if(this.dir == \"h\"){\r\n            mx = this.markPos.x-mtxt.width*0.5;\r\n            my = this.markPos.y+6;\r\n        }\r\n        this.ctx.fillStyle = \"#FFF\";\r\n        ctx.fillRect(mx, my-16, mtxt.width, 18);\r\n        this.ctx.fillStyle = '#FE1616';\r\n        this.ctx.fillText(length, mx, my);\r\n    };\r\n    //绘制虚线\r\n    this.drawDottedLine = function(){\r\n        this.ctx.save();\r\n        this.ctx.beginPath();\r\n        this.ctx.setLineDash([5]);\r\n        if(this.dir == \"v\"){\r\n            this.ctx.moveTo(this.p1.x-1000,this.p1.y);\r\n            this.ctx.lineTo(this.p1.x+1000,this.p1.y);\r\n            this.ctx.moveTo(this.p2.x-1000,this.p2.y);\r\n            this.ctx.lineTo(this.p2.x+1000,this.p2.y);\r\n        }\r\n        if(this.dir == \"h\"){\r\n            this.ctx.moveTo(this.p1.x,this.p1.y-1000);\r\n            this.ctx.lineTo(this.p1.x,this.p1.y+1000);\r\n            this.ctx.moveTo(this.p2.x,this.p2.y-1000);\r\n            this.ctx.lineTo(this.p2.x,this.p2.y+1000);\r\n        }\r\n        this.ctx.stroke();\r\n        this.ctx.closePath();\r\n        this.ctx.restore();\r\n    };\r\n};\r\n\r\nmodule.exports = LengthMark; \r\n\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/lengthMark.js\n ** module id = 4\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/lengthMark.js?");

/***/ },
/* 5 */
/***/ function(module, exports) {

	eval("\r\n/*\r\n*背景图操作类\r\n*/\r\n\r\nvar bg = {\r\n    ctx:null,\r\n    //背景图\r\n    background:null,\r\n    dpr:1\r\n};\r\n\r\nbg.init = function(ctx){\r\n    this.ctx = ctx;\r\n};\r\n\r\nbg.setBG = function (screenShot) {\r\n    var image = new Image();\r\n    image.src = screenShot;\r\n    this.background = image;\r\n    this.dpr = window.devicePixelRatio;\r\n}\r\n\r\n//背景图\r\nbg.drawBG = function(){\r\n    var _ = this;\r\n    var ctx = _.ctx;\r\n    if(_.background){\r\n        ctx.drawImage(_.background,0,0,\r\n        _.background.width/_.dpr,\r\n        _.background.height/_.dpr);\r\n    }\r\n};\r\n\r\nmodule.exports = bg;\r\n\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/background.js\n ** module id = 5\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/background.js?");

/***/ },
/* 6 */
/***/ function(module, exports) {

	eval("\r\n/*\r\n根据缩放的等级 计算可视区域\r\n*/\r\n\r\nvar zoom = {\r\n    /*等级从1到10，1是1：1的*/\r\n    level:2,\r\n    /*中心点*/\r\n    center:{x:0,y:0},\r\n    ww:0,\r\n    wh:0\r\n};\r\n\r\nzoom.init = function (ww,wh) {\r\n    var _ = this;\r\n    _.center.x = ww*0.5;\r\n    _.center.y = wh*0.5;\r\n    _.ww = ww;\r\n    _.wh = wh;\r\n};\r\n\r\nzoom.calViewBox = function () {\r\n    var _ = this;\r\n    var box = {\r\n        sx:0,\r\n        sy:0,\r\n        sw:0,\r\n        sh:0\r\n    }\r\n\r\n    box.sw =  _.ww/_.level;\r\n    box.sx = _.center.x -  box.sw*0.5;\r\n    box.sh = _.wh/_.level;\r\n    box.sy = _.center.y - box.sh*0.5;\r\n\r\n    return  box;\r\n};\r\n\r\nmodule.exports = zoom;\r\n\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/zoom.js\n ** module id = 6\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/zoom.js?");

/***/ }
/******/ ]);