/**
 * Created by 15050971 on 2016/4/14.
 */

var BezierCurveTo = function(cpx1,cpy1,cpx2,cpy2,x,y){
    this.x = x;
    this.y = y;
    this.cpx1 = cpx1;
    this.cpy1 = cpy1;
    this.cpx2 = cpx2;
    this.cpy2 = cpy2;
};

module.exports = BezierCurveTo;