
/*
*@description 编辑图形
*/
var map = require('./../map');

var editGraphics = function (state, action) {
    state = state || {};
    switch (action.type) {
        case "3_mousemove"://hover图形
            //遍历图形 hover中的图形 设置高亮状态
            var dt = action.data;
            map.curLayer.hitTest(dt.x,dt.y);
            return state;
        default:
            return state;
    }
};


module.exports = editGraphics;


