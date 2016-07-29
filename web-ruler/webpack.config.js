
var webpack = require('webpack');
var path = require('path');
var buildPath = path.resolve(__dirname,"");
var nodemodulesPath = path.resolve(__dirname,'node_modules');

var config = {
    //入口文件配置
    entry:path.resolve(__dirname,'src/main.js'),
    resolve:{
        extentions:["","js"]//当requrie的模块找不到时，添加这些后缀
    },
    devtool: 'eval',
    //文件导出的配置
    output:{
        path:buildPath,
        filename:"content_script.js"
    }
}

module.exports = config;

