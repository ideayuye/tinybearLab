/**
 * Created by tinybear on 2016/4/4.
 */

var Line = function(ctx){
    this.ctx = ctx;
};

Line.prototype = {
    p1:{x:0,y:0},
    p2:{x:0,y:0},
    step:1,
    processInput:function(data){
        var mouseType = data.mouseType;
        var x = data.x;
        var y = data.y;
        switch (this.step){
            case 1:
                if(mouseType == 'mousedown'){
                    this.p1.x = x;
                    this.p1.y = y;
                    this.step ++;
                }
                break;
            case 2:
                if(mouseType == "mousemove"){

                }
                if(mouseType == "mouseup"){
                    this.p2.x = x;
                    this.p2.y = y;
                    this.reset();
                }
                break;
        }

    },
    cancel:function(){

    },
    draw:function(){
        this.ctx.beginPath();
        this.ctx.moveTo(this.p1.x,this.p1.y);
        this.ctx.lineTo(this.p2.x,this.p2.y);
        this.ctx.stroke();
        this.ctx.closePath();
    },
    reset:function(){
        this.step = 1;
    }
};

module.exports = Line;
