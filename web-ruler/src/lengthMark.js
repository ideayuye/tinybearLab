

var LengthMark = function(ctx) {
    this.ctx = ctx;
    this.isRetina = false;
    this.id = "lm_" + (new Date()).valueOf();
    this.p1 = {
        x: 0,
        y: 0,
        isOK: 0
    };
    this.p2 = {
        x: 0,
        y: 0,
        isOK: 0
    };
    //在显示屏上的坐标
    this.vP1 = {x:0,y:0};
    this.vP2 = {x:0,y:0};
    this.dir = "";
    this.setP1 = function(x, y) {
        this.p1.x = x + 0.5;
        this.p1.y = y + 0.5;
        this.p1.isOK = 1;
    };
    this.setP2 = function(x, y) {
        var dir = this.judgeDir(x, y);
        this.dir = dir;
        if (dir == "v") {
            this.p2.x = this.p1.x;
            this.p2.y = y + 0.5;
        }
        if (dir == "h") {
            this.p2.x = x + 0.5;
            this.p2.y = this.p1.y;
        }
        this.p2.isOK = 1;
    };
    this.step = 0;
    this.isEnd = function() {
        return this.step == 3 ? true : false;
    };
    this.dx = function() {
        var dx = 0;
        if (this.p1.isOK && this.p2.isOK) {
            dx = this.p1.x - this.p2.x;
            dx = Math.round(Math.abs(dx));
        }
        return dx;
    };
    this.dy = function() {
        var dy = 0;
        if (this.p1.isOK && this.p2.isOK) {
            dy = this.p1.y - this.p2.y;
            dy = Math.round(Math.abs(dy));
        }
        return dy;
    };
    this.length = function() {
        var length = "";
        if (this.dir == "v") {
            length = this.dy();
        }
        if (this.dir == "h") {
            length = this.dx();
        }
        return length;
    };
    this.markPos = {
        x: 0,
        y: 0
    };
};

//计算长度标记的位置
LengthMark.prototype.calMarkPos = function() {
    var dir = this.dir,
        p1 = this.vP1,
        p2 = this.vP2;
    var x, y;
    if (dir == "v") {
        x = p1.x;
        y = Math.round((p1.y + p2.y) * 0.5);
    }
    if (dir == "h") {
        x = Math.round((p1.x + p2.x) * 0.5);
        y = p1.y;
    }
    this.markPos = {
        x: x,
        y: y
    };
};
//判断方向
LengthMark.prototype.judgeDir = function(x, y) {
    if (this.p1.isOK) {
        var p1 = this.p1;
        var dx = Math.abs(x - p1.x);
        var dy = Math.abs(y - p1.y);
        var tan = dy / dx;
        if (tan > 1)
            return "v";
        else
            return "h";
    }
};

//把存储坐标映射到显示屏坐标
LengthMark.prototype.mapCoords = function(mapFun){
        var _ = this;
        var p1 = _.p1;
        _.vP1 = mapFun(p1.x,p1.y);
        var p2 = _.p2;
        _.vP2 = mapFun(p2.x,p2.y);
    };

/*处理输入的数据 */
LengthMark.prototype.process = function(data) {
    switch (data.mouseType) {
        case "mousedown":
            if (this.step == 0) {
                this.setP1(data.x, data.y);
                this.step = 1;
            }
            break;
        case "mousemove":
            if (this.p1.isOK) {
                this.setP2(data.x, data.y);
                this.step = 2;
            }
            break;
        case "mouseup":
            if (this.step == 2) {
                this.setP2(data.x, data.y);
                this.step = 3;
            }
            break;
    }
};


LengthMark.prototype.draw = function() {
    var _ = this;
    if (_.step < 2)
        return;
    _.drawMark();
    _.drawNode();
    _.step == 2 && _.drawDottedLine();
};

/*绘制节点 */
LengthMark.prototype.drawNode = function() {
    var ctx = this.ctx,
        p1 = this.vP1,
        p2 = this.vP2,
        hh = 5;
    ctx.beginPath();
    if(this.isRetina){
        hh = 10;
    }
    if (this.dir == "v") {
        ctx.moveTo(p1.x - hh, p1.y);
        ctx.lineTo(p1.x + hh, p1.y);
        ctx.moveTo(p2.x - hh, p2.y);
        ctx.lineTo(p2.x + hh, p2.y);
    }
    if (this.dir == "h") {
        ctx.moveTo(p1.x, p1.y - hh);
        ctx.lineTo(p1.x, p1.y + hh);
        ctx.moveTo(p2.x, p2.y - hh);
        ctx.lineTo(p2.x, p2.y + hh);
    }
    ctx.stroke();
    ctx.closePath();
};

/*绘制标注*/  
LengthMark.prototype.drawMark = function() {
    var ctx = this.ctx,
        me = this,
        length = this.length(),
        p1 = this.vP1,
        p2 = this.vP2;
    
    ctx.font = "16px arial";
    ctx.lineWidth = 1;
    if(me.isRetina){
        ctx.font = "32px arial";
    }
    var mtxt = this.ctx.measureText(length);
    ctx.strokeStyle = '#FE1616';
    ctx.beginPath();
    
    //绘制线
    var x1 = p1.x,
        y1 = p1.y,
        x2 = p2.x,
        y2 = p2.y;
    //如果第一个点在第二个点下方 互换
    if (p1.x + p1.y > p2.x + p2.y) {
        x1 = p2.x;
        y1 = p2.y;
        x2 = p1.x;
        y2 = p1.y;
    }
    if (length > 20) { //大于20内连接
        if (this.dir == "v") {
            var my = Math.round((p1.y + p2.y) * .5);
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1, my-10);
            ctx.moveTo(x2, my+10);
            ctx.lineTo(x2, y2);
        }
        if (this.dir == "h") {
            var mx = Math.round((p1.x + p2.x) * .5);
            var hw = mtxt.width*0.5;
            ctx.moveTo(x1, y1);
            ctx.lineTo(mx-hw, y1);
            ctx.moveTo(mx+hw, y2);
            ctx.lineTo(x2, y2);
        }
    } else { //小于20外连接
        if (this.dir == "v") {
            ctx.moveTo(x1, y1-6);
            ctx.lineTo(x1, y1);
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2, y2+6);
        }
        if (this.dir == "h") {
            ctx.moveTo(x1-6, y1);
            ctx.lineTo(x1, y1);
            ctx.moveTo(x2+6, y2);
            ctx.lineTo(x2, y2);
        }
    }
    ctx.stroke();
    ctx.closePath();

    var mx = 0,
        my = 0;
    this.calMarkPos();
    if(length > 20){
        mx = this.markPos.x - mtxt.width * 0.5;
        my = this.isRetina? this.markPos.y+12 : this.markPos.y + 6;
    }else{
        if (this.dir == "v") {
            mx = this.markPos.x + 10;
            my = this.markPos.y + 6;
        }
        if (this.dir == "h") {
            mx = this.markPos.x - mtxt.width * 0.5;
            my = this.markPos.y - 10;
        }
    }
    ctx.fillStyle = '#FE1616';
    ctx.fillText(length, mx, my);
};

/*绘制虚线*/ 
LengthMark.prototype.drawDottedLine = function() {
    var ctx = this.ctx,
        p1 = this.vP1,
        p2 = this.vP2;
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([5]);
    if (this.dir == "v") {
        ctx.moveTo(p1.x - 1000, p1.y);
        ctx.lineTo(p1.x + 1000, p1.y);
        ctx.moveTo(p2.x - 1000, p2.y);
        ctx.lineTo(p2.x + 1000, p2.y);
    }
    if (this.dir == "h") {
        ctx.moveTo(p1.x, p1.y - 1000);
        ctx.lineTo(p1.x, p1.y + 1000);
        ctx.moveTo(p2.x, p2.y - 1000);
        ctx.lineTo(p2.x, p2.y + 1000);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
};

module.exports = LengthMark;

