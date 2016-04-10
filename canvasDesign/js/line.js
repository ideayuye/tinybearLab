/**
 * Created by tinybear on 2016/4/4.
 */


var Line = function(ctx){
    this.ctx = ctx;
};

Line.prototype = {
    p1:{x:0,y:0,isOK:0},
    p2:{x:0,y:0,isOK:0},
    setP1:function(x,y){
        this.p1.x = x;
        this.p1.y = y;
        this.p1.isOK = 1;
    },
    setP2:function(x,y){
        this.p2.x = x;
        this.p2.y = y;
        this.p2.isOK = 1;
    },
    step:0,
    get isEnd (){
        return this.step == 3? true:false;
    },
    process:function(data){
        switch(data.mouseType){
            case "mousedown":
                if(this.step == 0) {
                    this.setP1(data.x, data.y);
                    this.step = 1;
                }
                break;
            case "mousemove":
                if(this.p1.isOK) {
                    this.setP2(data.x, data.y);
                    this.step = 2;
                }
                break;
            case "mouseup":
                if(this.step == 2) {
                    this.setP2(data.x, data.y);
                    this.step = 3;
                }
                break;
        }
    },
    draw:function(){
        if(this.p1.isOK){
            this.ctx.fillStyle = "#07a";
            this.ctx.fillRect(this.p1.x-2, this.p1.y-2, 4, 4);
        }
        if(this.p2.isOK){
            this.ctx.fillStyle = "#07a";
            this.ctx.fillRect(this.p2.x-2, this.p2.y-2, 4, 4);
        }
        if(this.step < 2)
            return;
        this.ctx.beginPath();
        this.ctx.moveTo(this.p1.x,this.p1.y);
        this.ctx.lineTo(this.p2.x,this.p2.y);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    //绘制节点
};

module.exports = Line;
