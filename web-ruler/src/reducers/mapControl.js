
/*
*@description 操作面板
*/

var zoom = require('./../zoom');

var mapControl = function (state, action) {
    state = state || {};
    switch (action.type) {
        case "2_mousedown":
            state.startX = action.data.ox;
            state.startY = action.data.oy;
            state.endX = 0;
            state.endY = 0;
            state.mx = 0;
            state.my = 0;
            state.isPan = 1;
            return state;
        case "2_mousemove":
            if(state.isPan){
                state.endX = action.data.ox;
                state.endY = action.data.oy;
                state.mx = state.startX - state.endX;
                state.my = state.startY - state.endY;
                state.startX = action.data.ox;
                state.startY = action.data.oy;   
                zoom.move(state.mx, state.my);
            }
            return state;
        case "2_mouseup":
            state.isPan = 0;
            return state;
        default:
            return state;
    }
};


module.exports = mapControl;

