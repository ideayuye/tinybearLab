/*
*@description 处理用户输入的数据
*/

var curPath ;

var dispatch = {
    canvas:null,
    init:function(cc){
        this.canvas = cc;
    },
    process:function(data){
        //根据action判断当前图形 图形的绘制进展
        switch(data.action){
            case 1:
                this.canvas.
                break;
            case 2:
                break;
        }
        //mousedown
        //mouseup
        //mousemove
        //click

        //图形绘制中添加到临时图层

        //图形绘制完成 添加到指定的图层

    }
}

module.exports = dispatch;
