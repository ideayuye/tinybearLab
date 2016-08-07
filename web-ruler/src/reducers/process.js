
/*
*@description 处理用户输入的数据
*/

var LengthMark = require('./../lengthMark.js');
var bg = require('./../background.js');

var process = function (state, action) {
    state = state || { };
    switch (action.type) {
        case "1_mousedown":
            if (!state.curPath) {
                state.curPath = new LengthMark(state.cacheCtx);
                state.tempLayer.addPath(state.curPath);
                state.curPath.process(action.data);
                state.isUpdate = true;
            }
            return state;
        case "1_mousemove":
        case "1_mouseup":
            if (state.curPath) {
                state.curPath.process(action.data);
                if (state.curPath.isEnd()) {
                    var id = state.curPath.id;
                    state.tempLayer.remove(id);
                    state.curLayer.addPath(state.curPath);
                    state.curPath = null;
                }
                state.isUpdate = true;
            }
            return state;
        case "setbackground":
            if(!state.bg){
                state.bg = bg;
                state.bg.init(state.cacheCtx);
            }
            state.bg.setBG(action.screenShot);
            state.isUpdate = true;
            return state;
        default:
            return state;
    }
};


module.exports = process;

