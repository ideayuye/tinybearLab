
var LengthMark = function(ctx){
    this.ctx = ctx;
    this.id = "lm_" + (new Date()).valueOf();
    this.p1={x:0,y:0,isOK:0};
    this.p2={x:0,y:0,isOK:0};
    this.setP1=function(x,y){
        this.p1.x = x;
        this.p1.y = y;
        this.p1.isOK = 1;
    };
    this.setP2=function(x,y){
        var dir = this.judgeDir();
        if(dir == "v"){
            this.p2.x = x;
            this.p2.y = y;
        }
        this.p2.isOK = 1;
    };
    this.step = 0;
    this.isEnd = function(){
        return this.step == 3? true:false;
    };
    //判断方向
    this.judgeDir = function (data) {
        if(p1.isOK){
            var dx = Math.abs(data.x-p1.x);
            var dy = Math.abs(data.y-p1.y);
            var tan = dy/dx;
            if(tan>1)
                return "h";
            else
                return "v";
        }
    }
    this.process=function(data){
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
    };
    this.draw=function(){
        //this.drawNode();
        if(this.step < 2)
            return;
        this.ctx.beginPath();
        this.ctx.moveTo(this.p1.x,this.p1.y);
        this.ctx.lineTo(this.p2.x,this.p2.y);
        this.ctx.stroke();
        this.ctx.closePath();
    };
    //绘制节点
    this.drawNode=function(){
        this.ctx.fillStyle = "#07a";
        if(this.p1.isOK){
            this.ctx.fillRect(this.p1.x-2, this.p1.y-2, 4, 4);
        }
        if(this.p2.isOK){
            this.ctx.fillRect(this.p2.x-2, this.p2.y-2, 4, 4);
        }
    };
};

module.exports = LengthMark; 
