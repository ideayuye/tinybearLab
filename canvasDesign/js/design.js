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
var cc   = new Canvas();
dispatch.init(cc);
var line = new Line(ctx);
var design = {
    action:1,
    init:function(){
        canvas.width = cvsPanel.offsetWidth;
        canvas.height = cvsPanel.offsetHeight;
        this.bindDraw();
        this.animate();
    },
    bindDraw:function(){
        var that = this;
        $canvas.on('mousedown',function(e){
            var data = {
                mouseType:'mousedown',
                x:e.x,
                y:e.y,
                action:this.action
            };
            dispatch.process(data);
        });
        $canvas.on('mouseup',function(e){
            var data = {
                mouseType:'mouseup',
                x:e.x,
                y:e.y,
                action:this.action
            };
            dispatch.process(data);
        });
        $canvas.on('mousemove',function(e){
            var data = {
                mouseType:'mouseup',
                x:e.x,
                y:e.y,
                action:this.action
            };
            dispatch.process(data);
        });
        $canvas.on('click',function(e){
        });

    },
    animate:function(){
        //重绘页面
        window.requestAnimationFrame(this.animate);
    }
};

module.exports = design;
