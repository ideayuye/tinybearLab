
var LengthMark = function(ctx){
    this.ctx = ctx;
    this.id = "lm_" + (new Date()).valueOf();
    this.p1={x:0,y:0,isOK:0};
    this.p2={x:0,y:0,isOK:0};
    this.dir = "";
    this.setP1=function(x,y){
        this.p1.x = x+0.5;
        this.p1.y = y+0.5;
        this.p1.isOK = 1;
    };
    this.setP2=function(x,y){
        var dir = this.judgeDir(x,y);
        this.dir = dir;
        if(dir == "v"){
            this.p2.x = this.p1.x;
            this.p2.y = y+0.5;
        }
        if(dir == "h"){
            this.p2.x = x+0.5;
            this.p2.y = this.p1.y;
        }
        this.calMarkPos();
        this.p2.isOK = 1;
    };
    this.step = 0;
    this.isEnd = function(){
        return this.step == 3? true:false;
    };
    this.dx = function(){
        var dx = 0;
        if(this.p1.isOK && this.p2.isOK){
            dx = this.p1.x - this.p2.x;
            dx = Math.abs(dx);
        }
        return dx;
    };
    this.dy = function(){
        var dy = 0;
        if(this.p1.isOK && this.p2.isOK){
            dy = this.p1.y - this.p2.y;
            dy = Math.abs(dy);
        }
        return dy;
    };
    this.markPos = {x:0,y:0};
    //计算长度标记的位置
    this.calMarkPos = function(){
        var dir = this.dir;
        var x,y;
        if(dir == "v"){
            x = this.p1.x;
            y = Math.round((this.p1.y+this.p2.y)*0.5);
        }
        if(dir == "h"){
            x = Math.round((this.p1.x+this.p2.x)*0.5);
            y = this.p1.y;
        }
        this.markPos = {x:x,y:y};
    };
    //判断方向
    this.judgeDir = function (x,y) {
        if(this.p1.isOK){
            var p1 = this.p1;
            var dx = Math.abs(x-p1.x);
            var dy = Math.abs(y-p1.y);
            var tan = dy/dx;
            if(tan>1)
                return "v";
            else
                return "h";
        }
    };
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
        if(this.step < 2)
            return;
        this.ctx.stokeStyle = '#FE1616';
        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.moveTo(this.p1.x,this.p1.y);
        this.ctx.lineTo(this.p2.x,this.p2.y);
        this.ctx.stroke();
        this.ctx.closePath();
        this.drawMark();
        this.drawNode();
        if(this.step == 2){
            this.drawDottedLine();
        }
    };
    //绘制节点
    this.drawNode=function(){
        this.ctx.beginPath();
        if(this.dir == "v"){
            this.ctx.moveTo(this.p1.x-5,this.p1.y);
            this.ctx.lineTo(this.p1.x+5,this.p1.y);
            this.ctx.moveTo(this.p2.x-5,this.p2.y);
            this.ctx.lineTo(this.p2.x+5,this.p2.y);
        }
        if(this.dir == "h"){
            this.ctx.moveTo(this.p1.x,this.p1.y-5);
            this.ctx.lineTo(this.p1.x,this.p1.y+5);
            this.ctx.moveTo(this.p2.x,this.p2.y-5);
            this.ctx.lineTo(this.p2.x,this.p2.y+5);
        }
        this.ctx.stroke();
        this.ctx.closePath();
    };
    //绘制标注
    this.drawMark = function(){
        var length = "";
        if(this.dir == "v"){
            length = this.dy();
        }
        if(this.dir == "h"){
            length = this.dx();
        }
        this.ctx.font = "16px arial";
        var mtxt = this.ctx.measureText(length);
        var mx = 0,my = 0;
        if(this.dir == "v"){
            mx = this.markPos.x-mtxt.width*0.5;
            my = this.markPos.y+6;
        }
        if(this.dir == "h"){
            mx = this.markPos.x-mtxt.width*0.5;
            my = this.markPos.y+6;
        }
        this.ctx.fillStyle = "#FFF";
        ctx.fillRect(mx, my-16, mtxt.width, 18);
        this.ctx.fillStyle = '#FE1616';
        this.ctx.fillText(length, mx, my);
    };
    //绘制虚线
    this.drawDottedLine = function(){
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.setLineDash([5]);
        if(this.dir == "v"){
            this.ctx.moveTo(this.p1.x-1000,this.p1.y);
            this.ctx.lineTo(this.p1.x+1000,this.p1.y);
            this.ctx.moveTo(this.p2.x-1000,this.p2.y);
            this.ctx.lineTo(this.p2.x+1000,this.p2.y);
        }
        if(this.dir == "h"){
            this.ctx.moveTo(this.p1.x,this.p1.y-1000);
            this.ctx.lineTo(this.p1.x,this.p1.y+1000);
            this.ctx.moveTo(this.p2.x,this.p2.y-1000);
            this.ctx.lineTo(this.p2.x,this.p2.y+1000);
        }
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    };
};

module.exports = LengthMark; 

