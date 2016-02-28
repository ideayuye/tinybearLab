
var roundRect = function (x, y, w, h, r) {
        //if (w < 2 * r) r = w / 2;
        //if (h < 2 * r) r = h / 2;
        this.beginPath();
        this.moveTo(x+r, y);
        this.arcTo(x+w, y, x+w, y+h, r);
        this.arcTo(x+w, y+h, x, y+h, r);
        this.arcTo(x, y+h, x, y, r);
        this.arcTo(x, y, x+w, y, r);
        // this.arcTo(x+r, y);
        this.fill();
        return this;
    }
    
CanvasRenderingContext2D.prototype.roundRect = roundRect;

var canvas = document.getElementById('cav_lion');
var ctx = canvas.getContext("2d");

//基本变量
var mx = 80,
    my = 80;
    
ctx.save();
// ctx.strokeRect(5,5,180,180);
ctx.fillStyle = '#F8B500';

ctx.translate(mx,my);
ctx.roundRect(0,0,140,140,16);

ctx.translate(70,-30);
ctx.rotate(45/180*Math.PI);
ctx.roundRect(0,0,140,140,16);

ctx.setTransform(1, 0, 0, 1, mx, my);//重置旋转
ctx.fillStyle = '#fff';
ctx.translate(20,90);
ctx.beginPath();
ctx.moveTo(20,0);
ctx.lineTo(60,0);
ctx.arc(80,20,20,-90/180*Math.PI,90/180*Math.PI);
ctx.lineTo(20,40);
ctx.arc(20,20,20,90/180*Math.PI,270/180*Math.PI);
ctx.fill();
ctx.beginPath();
ctx.arc(50,6,28,0,Math.PI,true);
ctx.fill();

//鼻子
ctx.setTransform(1, 0, 0, 1, mx, my);//重置旋转
ctx.translate(53,88);
ctx.fillStyle = '#000';
ctx.beginPath();
ctx.moveTo(0,0);
ctx.lineTo(34,0);
ctx.arcTo(38,7,24,17,4);
ctx.arcTo(15,17,0,7,4);
ctx.lineTo(0,7);
ctx.arcTo(-3,0,10,0,4);
ctx.fill();

//左眼角
ctx.fillStyle = '#000';
ctx.setTransform(1, 0, 0, 1, mx, my);//重置旋转
ctx.translate(20,50);
ctx.beginPath();
ctx.arc(13,13,13,0,2*Math.PI);
ctx.fill();

ctx.translate(4,16);
ctx.fillStyle = '#fff';
ctx.beginPath();
ctx.arc(3,3,3,0,2*Math.PI);
ctx.fill();

ctx.translate(-4,-16);

ctx.translate(9,4);
ctx.fillStyle = '#fff';
ctx.beginPath();
ctx.arc(6,6,6,0,2*Math.PI);
ctx.fill();

//右眼睛
ctx.fillStyle = '#000';
ctx.setTransform(1, 0, 0, 1, mx, my);//重置旋转
ctx.translate(92,50);
ctx.beginPath();
ctx.arc(13,13,13,0,2*Math.PI);
ctx.fill();

ctx.translate(15,16);
ctx.fillStyle = '#fff';
ctx.beginPath();
ctx.arc(3,3,3,0,2*Math.PI);
ctx.fill();

ctx.translate(-15,-16);

ctx.translate(4,4);
ctx.fillStyle = '#fff';
ctx.beginPath();
ctx.arc(6,6,6,0,2*Math.PI);
ctx.fill();

