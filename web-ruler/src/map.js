
var Layer = require('./Layer.js');

var map = {
    tempLayer: new Layer(),
    curLayer: new Layer(),
    cacheCtx: null,
    viewCtx:null,
    bg: null
}


module.exports = map;
