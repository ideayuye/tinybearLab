/**
 * Created by tinybear on 2016/3/27.
 */

var c = document.getElementById("canvas-club");
var ctx = c.getContext("2d");
var w = c.width = window.innerWidth;
var h = c.height = window.innerHeight;
var clearColor = 'rgba(0, 0, 0, .1)';
//var clearColor = 'rgba(255, 255, 255, .1)';

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function Rippling(){}

Rippling.prototype = {
    init:function(){
        this.x = random(0,w);
        this.y = random(h * .8, h * .9);
        this.color = 'hsl(180, 100%, 50%)';
        this.w = 2;
        this.h = 1;
        this.vw = 3;
        this.vh = 1;
        this.a = 1;
        this.va = .96;
    },
    draw:function(){
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.h / 2);

        ctx.bezierCurveTo(
            this.x + this.w / 2, this.y - this.h / 2,
            this.x + this.w / 2, this.y + this.h / 2,
            this.x, this.y + this.h / 2);

        ctx.bezierCurveTo(
            this.x - this.w / 2, this.y + this.h / 2,
            this.x - this.w / 2, this.y - this.h / 2,
            this.x, this.y - this.h / 2);

        ctx.strokeStyle = 'hsla(180, 100%, 50%, '+this.a+')';
        //ctx.strokeStyle = 'rgba(255,255,255,1)';
        ctx.stroke();
        ctx.closePath();
        this.update();
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

//初始化一个雨滴
var r = new Rippling();
r.init();

function anim() {
    ctx.fillStyle = clearColor;
    ctx.fillRect(0,0,w,h);
    r.draw();
    requestAnimationFrame(anim);
}



window.addEventListener("resize", resize);

anim();