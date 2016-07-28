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

	eval("\r\n\r\nvar button = document.createElement('button');\r\nbutton.innerText = \"截图\";\r\ndocument.body.appendChild(button);\r\n\r\nvar getScreenShot = function () {\r\n    chrome.runtime.sendMessage({ n: \"sall\" }, function (response) {\r\n        console.log(response);\r\n    });\r\n}\r\n\r\ngetScreenShot();\r\n\r\nbutton.addEventListener('click',getScreenShot);\r\n\r\nvar dw = __webpack_require__(1);\r\n\r\ndw.init();\r\n\r\n\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/main.js\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/main.js?");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	eval("\nvar Line = __webpack_require__(2);\n\nvar dw = {};\n\nvar ww = window.innerWidth;\nvar wh = document.body.clientHeight;\nvar canvas = null;\n\ndw.action = 1;\ndw.curPath = null;\ndw.lines = [];\n\ndw.init = function() {\n    canvas = document.createElement('canvas');\n    canvas.setAttribute('id', 'ruler-panel');\n    canvas.setAttribute('width', ww);\n    canvas.setAttribute('height', wh);\n    document.body.appendChild(canvas);\n    ctx = canvas.getContext('2d');\n\n    this.bindDraw();\n    animate();\n};\n\ndw.bindDraw = function () {\n    var that = this;\n    var wrapperData = function (type, e) {\n        return {\n            mouseType: type,\n            x: e.x,\n            y: e.y,\n            action: that.action\n        };\n    };\n    canvas.addEventListener('mousedown',function(e){\n        var data = wrapperData('mousedown', e);\n        that.process(data);\n    });\n\n    canvas.addEventListener('mouseup', function (e) {\n        var data = wrapperData('mouseup', e);\n        that.process(data);\n    });\n    canvas.addEventListener('mousemove', function (e) {\n        var data = wrapperData('mousemove', e);\n        that.process(data);\n    });\n};\n\ndw.process = function (data) {\n    //根据action判断当前图形 图形的绘制进展\n    switch (data.action) {\n        case 1:\n            if (!this.curPath && data.mouseType == \"mousedown\") {\n                this.curPath = new Line(ctx);\n            }\n            if (this.curPath) {\n                this.curPath.process(data);\n                if (this.curPath.isEnd()) {\n                    // var id = this.curPath.id;\n                    dw.lines.push(this.curPath);\n                    this.curPath = null;\n                }\n            }\n            break;\n        default:\n            break;\n    }\n};\n\ndw.draw = function() {\n    this.lines.forEach(x=>{\n        x.draw();\n    });\n    // this.curPath && this.curPath.draw() && this.curPath.drawNode();\n};\n\nvar animate = function () {\n    //重绘页面\n    this.ctx.clearRect(0, 0, ww, wh);\n    dw.draw();\n    window.requestAnimationFrame(animate);\n};\n\nmodule.exports = dw;\n\n\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/draw.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/draw.js?");

/***/ },
/* 2 */
/***/ function(module, exports) {

	eval("/**\n * Created by tinybear on 2016/4/4.\n */\n\n\nvar Line = function(ctx){\n    this.ctx = ctx;\n    this.id = \"p_\" + (new Date()).valueOf();\n    this.p1={x:0,y:0,isOK:0};\n    this.p2={x:0,y:0,isOK:0};\n    this.setP1=function(x,y){\n        this.p1.x = x;\n        this.p1.y = y;\n        this.p1.isOK = 1;\n    };\n    this.setP2=function(x,y){\n        this.p2.x = x;\n        this.p2.y = y;\n        this.p2.isOK = 1;\n    };\n    this.step = 0;\n    this.isEnd = function(){\n        return this.step == 3? true:false;\n    };\n    this.process=function(data){\n        switch(data.mouseType){\n            case \"mousedown\":\n                if(this.step == 0) {\n                    this.setP1(data.x, data.y);\n                    this.step = 1;\n                }\n                break;\n            case \"mousemove\":\n                if(this.p1.isOK) {\n                    this.setP2(data.x, data.y);\n                    this.step = 2;\n                }\n                break;\n            case \"mouseup\":\n                if(this.step == 2) {\n                    this.setP2(data.x, data.y);\n                    this.step = 3;\n                }\n                break;\n        }\n    };\n    this.draw=function(){\n        //this.drawNode();\n        if(this.step < 2)\n            return;\n        this.ctx.beginPath();\n        this.ctx.moveTo(this.p1.x,this.p1.y);\n        this.ctx.lineTo(this.p2.x,this.p2.y);\n        this.ctx.stroke();\n        this.ctx.closePath();\n    };\n    //绘制节点\n    this.drawNode=function(){\n        this.ctx.fillStyle = \"#07a\";\n        if(this.p1.isOK){\n            this.ctx.fillRect(this.p1.x-2, this.p1.y-2, 4, 4);\n        }\n        if(this.p2.isOK){\n            this.ctx.fillRect(this.p2.x-2, this.p2.y-2, 4, 4);\n        }\n    };\n};\n\nmodule.exports = Line;\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/line.js\n ** module id = 2\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/line.js?");

/***/ }
/******/ ]);