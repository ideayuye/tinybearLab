
var cacheCvs = require('./cacheCanvas.js');
var Layer = require('./Layer.js');

var map = {
    tempLayer: new Layer(),
    curLayer: new Layer(),
    cacheCtx: null,
    viewCtx:null,
    bg: null
}

map.refresh = function(){
    var _ = this;
    _.bg.drawBG();
    _.curLayer.draw();
    _.tempLayer.draw();
}

module.exports = map;
