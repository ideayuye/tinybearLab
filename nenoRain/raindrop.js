/**
 * Created by tinybear on 2016/3/27.
 */

/**
 * Created by tinybear on 2016/3/26.
 */



var c = document.getElementById("canvas-club");
var ctx = c.getContext("2d");
var w = c.width = window.innerWidth;
var h = c.height = window.innerHeight;
var clearColor = 'rgba(0, 0, 0, .1)';

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function RainDrop(){}

RainDrop.prototype = {
    init:function(){
        this.x =  random(0, w);
        this.y = 0;
        this.color = 'hsl(180, 100%, 50%)';
        this.vy = random(4, 5);
        this.hit = random(h * .8, h * .9);
        this.size = 2;
    },
    draw:function(){
        if (this.y < this.hit) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size * 5);
        }
        this.update();
    },
    update:function(){
        if(this.y < this.hit){
            this.y += this.vy;
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
    ctx.fillStyle = clearColor;
    ctx.fillRect(0,0,w,h);
    r.draw();
    requestAnimationFrame(anim);
}


window.addEventListener("resize", resize);

anim();