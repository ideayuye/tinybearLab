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

	eval("\r\n\r\nvar button = document.createElement('button');\r\nbutton.innerText = \"截图\";\r\ndocument.body.appendChild(button);\r\n\r\nvar getScreenShot = function () {\r\n    chrome.runtime.sendMessage({ n: \"sall\" }, function (response) {\r\n        console.log(response);\r\n    });\r\n}\r\n\r\ngetScreenShot();\r\n\r\nbutton.addEventListener('click',getScreenShot);\r\n\r\nvar draw = __webpack_require__(1);\r\ndraw.init();\r\n\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/main.js\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/main.js?");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	eval("\r\n\r\nvar Line = __webpack_require__(2);\r\nvar Layer = __webpack_require__(3);\r\n\r\nvar dw = {\r\n    action: 1,\r\n    curPath: null,\r\n    tempLayer: new Layer(),\r\n    curLayer: new Layer()\r\n};\r\n\r\nvar ww = 500;\r\nvar wh = 500;\r\nvar ctx = null;\r\nvar canvas = null;\r\n\r\ndw.init = function () {\r\n    canvas = document.createElement('canvas');\r\n    canvas.setAttribute('id', 'ruler-panel');\r\n    document.body.appendChild(canvas);\r\n    ww = canvas.offsetWidth;\r\n    wh = canvas.offsetHeight;\r\n    canvas.setAttribute('width', ww);\r\n    canvas.setAttribute('height', wh);\r\n    ctx = canvas.getContext('2d');\r\n\r\n    ctx.strokeStyle = \"red\";\r\n\r\n    this.bindDraw();\r\n    animate();\r\n}\r\n\r\ndw.bindDraw = function () {\r\n    var that = this;\r\n    var wrapperData = function (type, e) {\r\n        return {\r\n            mouseType: type,\r\n            x: e.x,\r\n            y: e.y,\r\n            action: that.action\r\n        };\r\n    };\r\n    canvas.addEventListener('mousedown', function (e) {\r\n        var data = wrapperData('mousedown', e);\r\n        that.process(data);\r\n    });\r\n    canvas.addEventListener('mouseup', function (e) {\r\n        var data = wrapperData('mouseup', e);\r\n        that.process(data);\r\n    });\r\n    canvas.addEventListener('mousemove', function (e) {\r\n        var data = wrapperData('mousemove', e);\r\n        that.process(data);\r\n    });\r\n\r\n}\r\n\r\ndw.process = function (data) {\r\n    //根据action判断当前图形 图形的绘制进展\r\n    switch (data.action) {\r\n        case 1:\r\n            if (!this.curPath && data.mouseType == \"mousedown\") {\r\n                this.curPath = new Line(ctx);\r\n                this.tempLayer.addPath(this.curPath);\r\n            }\r\n            if (this.curPath) {\r\n                this.curPath.process(data);\r\n                if (this.curPath.isEnd()) {\r\n                    var id = this.curPath.id;\r\n                    this.tempLayer.remove(id);\r\n                    this.curLayer.addPath(this.curPath);\r\n                    this.curPath = null;\r\n                }\r\n            }\r\n            break;\r\n        default:\r\n            break;\r\n    }\r\n}\r\n\r\nvar animate = function () {\r\n    //重绘页面\r\n    ctx.clearRect(0, 0, ww, wh);\r\n    dw.curLayer.draw();\r\n    dw.tempLayer.draw();\r\n    window.requestAnimationFrame(animate);\r\n};\r\n\r\nmodule.exports = dw;\r\n\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/draw.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/draw.js?");

/***/ },
/* 2 */
/***/ function(module, exports) {

	eval("\n/**\n * Created by tinybear on 2016/4/4.\n */\n\n\nvar Line = function(ctx){\n    this.ctx = ctx;\n    this.id = \"p_\" + (new Date()).valueOf();\n    this.p1={x:0,y:0,isOK:0};\n    this.p2={x:0,y:0,isOK:0};\n    this.setP1=function(x,y){\n        this.p1.x = x;\n        this.p1.y = y;\n        this.p1.isOK = 1;\n    };\n    this.setP2=function(x,y){\n        this.p2.x = x;\n        this.p2.y = y;\n        this.p2.isOK = 1;\n    };\n    this.step = 0;\n    this.isEnd = function(){\n        return this.step == 3? true:false;\n    };\n    this.process=function(data){\n        switch(data.mouseType){\n            case \"mousedown\":\n                if(this.step == 0) {\n                    this.setP1(data.x, data.y);\n                    this.step = 1;\n                }\n                break;\n            case \"mousemove\":\n                if(this.p1.isOK) {\n                    this.setP2(data.x, data.y);\n                    this.step = 2;\n                }\n                break;\n            case \"mouseup\":\n                if(this.step == 2) {\n                    this.setP2(data.x, data.y);\n                    this.step = 3;\n                }\n                break;\n        }\n    };\n    this.draw=function(){\n        //this.drawNode();\n        if(this.step < 2)\n            return;\n        this.ctx.beginPath();\n        this.ctx.moveTo(this.p1.x,this.p1.y);\n        this.ctx.lineTo(this.p2.x,this.p2.y);\n        this.ctx.stroke();\n        this.ctx.closePath();\n    };\n    //绘制节点\n    this.drawNode=function(){\n        this.ctx.fillStyle = \"#07a\";\n        if(this.p1.isOK){\n            this.ctx.fillRect(this.p1.x-2, this.p1.y-2, 4, 4);\n        }\n        if(this.p2.isOK){\n            this.ctx.fillRect(this.p2.x-2, this.p2.y-2, 4, 4);\n        }\n    };\n};\n\nmodule.exports = Line;\n\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/line.js\n ** module id = 2\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/line.js?");

/***/ },
/* 3 */
/***/ function(module, exports) {

	eval("\r\n/*\r\n*@description 图层\r\n**/\r\n\r\nvar Layer = function(){\r\n    this.paths={};\r\n    this.addPath=function(p){\r\n        this.paths[p.id] = p;\r\n    };\r\n    this.remove=function(id){\r\n        delete this.paths[id];\r\n    };\r\n    this.draw=function() {\r\n        for (var p in this.paths) {\r\n            this.paths[p].draw();\r\n        }\r\n    };\r\n};\r\n\r\nmodule.exports = Layer;\r\n\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/Layer.js\n ** module id = 3\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/Layer.js?");

/***/ }
/******/ ]);