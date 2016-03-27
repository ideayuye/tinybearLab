##canvas制作霓虹雨效果

在codepen上看到一个Canvas做的下雨效果动画，感觉蛮有意思的。就研究了下，这里来分享下，实现技巧。效果可以见下面的链接。

霓虹雨: [http://codepen.io/natewiley/full/NNgqVJ/](http://codepen.io/natewiley/full/NNgqVJ/ "霓虹雨")

效果截图
![霓虹雨](http://192.168.1.106:4003/%E9%9C%93%E8%99%B9%E9%9B%A8.png)

###Canvas动画基础
大家都知道，Canvas其实只是一个画板。我们可以应用canvas的api在上面绘制各种图形。
Canvas 2D 的API：
[https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D "canvas 2d API")

那么Canvas绘制动画的步骤就是：
1. 绘制第一帧图形（利用API绘图）
2. 清空画板(应用clearRect()或fillRect())
3. 绘制下一帧动画


用什么来控制动画每一帧的绘制时间呢？大家很容易想到 window.setInterval()和window.setTimeout()。没错用这两个也可以。除此之外，后来又出现一个新的方法：window.requestAnimationFrame(callback)。

requestAnimationFrame会告诉浏览器你要绘制一个动画。让浏览器要重绘时调用你指定的方法（callback）来绘制你的动画。
使用方法如下：
    
	function anim() {
	    ctx.fillStyle = clearColor;
	    ctx.fillRect(0,0,w,h);
	    for(var i in drops){
	        drops[i].draw();
	    }
	    requestAnimationFrame(anim);
	}

一般情况下优先使用requestAnimationFrame能保持动画绘制的频率和浏览器重绘的频率一致。不幸的是requestAnimationFrame的兼容性还不是很好。IE9以下和addroid 4.3以下好像不支持这个属性。不支持的浏览器要用setInterval或setTimeout做兼容。

###雨滴下落效果

首先来讲讲雨滴下落的效果如何制作。雨滴其实是一个长方形，然后加残影。残影的绘制可以说是雨滴下落的关键。残影是通过在前进的方向每一帧都绘制一个半透明的背景和一个长方形,然后前面绘制的图形叠加产生的效果。由于前进方向的图形最后绘制，所以显得明亮，后面的图形叠加的比较多，所以视觉上减弱。整体看起来后面的就像残影。这里绘制具有透明度背景是关键,否则产生不了叠加效果。

那么来绘制个雨滴看看。首先准备一个画板:
html代码：
    <!DOCTYPE html>
	<html lang="en">
	<head>
	    <meta charset="UTF-8">
	    <title>霓虹雨</title>
	    <meta name="viewport" content="width=device-width,initial-scale=1.0">
	    <style type="text/css">
	        .bg {
	            background: #000;
	            overflow: hidden;
	        }
	    </style>
	
	</head>
	<body class="bg">
	<canvas id="canvas-club"></canvas>
	<script type="text/javascript" src="raindrop.js"></script>
	</body>
	</html>

我在js文件里绘制动画（raindrop.js），代码如下：

	var c = document.getElementById("canvas-club");
	var ctx = c.getContext("2d");//获取canvas上下文
	var w = c.width = window.innerWidth;
	var h = c.height = window.innerHeight;//设置canvas宽、高
	var clearColor = 'rgba(0, 0, 0, .1)';//画板背景,注意最后的透明度0.1 这是产生叠加效果的基础
	
	function random(min, max) {
	    return Math.random() * (max - min) + min;
	}
	
	function RainDrop(){}
	//雨滴对象 这是绘制雨滴动画的关键
	RainDrop.prototype = {
	    init:function(){
	        this.x =  random(0, w);//雨滴的位置x
	        this.y = 0;//雨滴的位置y
	        this.color = 'hsl(180, 100%, 50%)';//雨滴颜色 长方形的填充色
	        this.vy = random(4, 5);//雨滴下落速度
	        this.hit = random(h * .8, h * .9);//下落的最大值
	        this.size = 2;//长方形宽度
	    },
	    draw:function(){
	        if (this.y < this.hit) {
	            ctx.fillStyle = this.color;
	            ctx.fillRect(this.x, this.y, this.size, this.size * 5);//绘制长方形，通过多次叠加长方形，形成雨滴下落效果
	        }
	        this.update();//更新位置
	    },
	    update:function(){
	        if(this.y < this.hit){
	            this.y += this.vy;//未达到底部，增加雨滴y坐标
	        }else{
	            this.init();
	        }
	    }
	};
	
	function resize(){
	    w = c.width = window.innerWidth;
	    h = c.height = window.innerHeight;
	}
	
	//初始化一个雨滴
	var r = new RainDrop();
	r.init();
	
	function anim() {
	    ctx.fillStyle = clearColor;//每一帧都填充背景色
	    ctx.fillRect(0,0,w,h);//填充背景色，注意不要用clearRect，否则会清空前面的雨滴，导致不能产生叠加的效果
	    r.draw();//绘制雨滴
	    requestAnimationFrame(anim);//控制动画帧
	}
	
	window.addEventListener("resize", resize);
	//启动动画
	anim();

###涟漪效果

接着来绘制涟漪效果。与绘制雨滴的方式类似,也是通过具有透明度的背景来叠加前面的图像产生内阴影的效果。

代码如下（rippling.js）：

	var c = document.getElementById("canvas-club");
	var ctx = c.getContext("2d");//获取canvas上下文
	var w = c.width = window.innerWidth;
	var h = c.height = window.innerHeight;//设置canvas宽、高
	var clearColor = 'rgba(0, 0, 0, .1)';//画板背景,注意最后的透明度0.1 这是产生叠加效果的基础
	
	function random(min, max) {
	    return Math.random() * (max - min) + min;
	}
	
	function Rippling(){}
	//涟漪对象 这是涟漪动画的主要部分
	Rippling.prototype = {
	    init:function(){
	        this.x = random(0,w);//涟漪x坐标
	        this.y = random(h * .8, h * .9);//涟漪y坐标
	        this.w = 2;//椭圆形涟漪宽
	        this.h = 1;//椭圆涟漪高
	        this.vw = 3;//宽度增长速度
	        this.vh = 1;//高度增长速度
	        this.a = 1;//透明度
	        this.va = .96;//涟漪消失的渐变速度
	    },
	    draw:function(){
	        ctx.beginPath();
	        ctx.moveTo(this.x, this.y - this.h / 2);
			//绘制右弧线
	        ctx.bezierCurveTo(
	            this.x + this.w / 2, this.y - this.h / 2,
	            this.x + this.w / 2, this.y + this.h / 2,
	            this.x, this.y + this.h / 2);
			//绘制左弧线
	        ctx.bezierCurveTo(
	            this.x - this.w / 2, this.y + this.h / 2,
	            this.x - this.w / 2, this.y - this.h / 2,
	            this.x, this.y - this.h / 2);
			
	        ctx.strokeStyle = 'hsla(180, 100%, 50%, '+this.a+')';
	        ctx.stroke();
	        ctx.closePath();
	        this.update();//更新坐标
	    },
	    update:function(){
	        if(this.a > .03){
	            this.w += this.vw;
	            this.h += this.vh;
	            if(this.w > 100){
	                this.a *= this.va;
	                this.vw *= .98;
	                this.vh *= .98;
	            }
	        } else {
	            this.init();
	        }
	
	    }
	};
	
	function resize(){
	    w = c.width = window.innerWidth;
	    h = c.height = window.innerHeight;
	}
	
	//初始化一个涟漪
	var r = new Rippling();
	r.init();
	
	function anim() {
	    ctx.fillStyle = clearColor;
	    ctx.fillRect(0,0,w,h);
	    r.draw();
	    requestAnimationFrame(anim);
	}
	
	window.addEventListener("resize", resize);
	//启动动画
	anim();


###总结

这样大家对整个下雨效果的制作方法，应该有一定的了解了。Canvas用来绘制动画的效果确实能让人眼前一亮，让web的视觉效果提升一大截。发动自己的智慧，相信能做出更多奇妙的动画。这是我越来越喜欢web的原因之一吧 O(∩_∩)O~~。

