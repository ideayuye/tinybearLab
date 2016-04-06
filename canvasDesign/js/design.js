/**
 * Created by tinybear on 2016/4/4.
 */

var Line     = require('./line');

//初始环境
var canvas   = document.getElementById('canvas');
var ctx      = canvas.getContext('2d');
var cvsPanel = document.getElementsByClassName('c-canvas-panel')[0];
var $canvas  = $('#canvas');

//图形
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

        });
        $canvas.on('mouseup',function(e){

        });
        $canvas.on('mousemove',function(e){
            //console.log('trigger',e.x,e.y);
        });
        $canvas.on('click',function(e){
            var data = {
                mouseType:'click',
                x:e.x,
                y:e.y
            };
            if(that.action == 1){
                line.processInput(data);
            }
        });

    },
    animate:function(){
        //临时图层
        //重绘页面
        line.draw();
        window.requestAnimationFrame(this.animate);
    }
};

module.exports = design;
