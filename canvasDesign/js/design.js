/**
 * Created by tinybear on 2016/4/4.
 */

var Canvas   = require('./Canvas');
var Line     = require('./Line');
var dispatch = require('./dispatch');

//初始环境
var canvas   = document.getElementById('canvas');
var ctx      = canvas.getContext('2d');
var cvsPanel = document.getElementsByClassName('c-canvas-panel')[0];
var $canvas  = $('#canvas');

//图形
var cc ;


var animate = function(){
    //重绘页面
    cc.draw();
    window.requestAnimationFrame(animate);
};

var design = {
    action:1,
    init:function(){
        canvas.width = cvsPanel.offsetWidth;
        canvas.height = cvsPanel.offsetHeight;
        cc =  new Canvas(ctx,canvas.width,canvas.height);
        dispatch.init(cc);
        animate();
        this.bindDraw();
    },
    bindDraw:function(){
        var that = this;
        var wrapperData = function(type,e){
            return {
                mouseType:type,
                x:e.x,
                y:e.y,
                action:that.action
            };
        };
        $canvas.on('mousedown',function(e){
            var data = wrapperData('mousedown',e);
            dispatch.process(data);
        });
        $canvas.on('mouseup',function(e){
            var data = wrapperData('mouseup',e);
            dispatch.process(data);
        });
        $canvas.on('mousemove',function(e){
            var data = wrapperData('mousemove',e);
            dispatch.process(data);
        });
        $canvas.on('click',function(e){
            var data = wrapperData('click',e);
            dispatch.process(data);
        });
    }
};



module.exports = design;

