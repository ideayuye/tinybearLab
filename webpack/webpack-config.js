
var webpack = require('webpack');
var path = require('path');
var buildPath = path.resolve(__dirname,"build");
var nodemodulesPath = path.resolve(__dirname,'node_modules');

var config = {
	entry:path.resolve(__dirname,'src/main.js'),
	// entry:{m1:path.resolve(__dirname,'src/main.js'),
	// 	m2:path.resolve(__dirname,'src/main1.js')},
	resolve:{
		extentions:["","js"]
	},
	output:{
		path:buildPath,
		filename:"app.js"
	},
	module:{
		loaders:[{
			test:/\.css$/,
			loader:'style!css',
			exclude:nodemodulesPath
		},
		{ test:/\.(png|woff|svg|ttf|eot)$/,loader:'url-loader?limit=10000'},
		{ test: /\.jpg$/, loader: "file-loader?name=[sha512:hash:base64:7].[ext]" },
		{ test: /\.html$/, loader: "handlebars-loader" }
		]
	}
	
}

module.exports = config;
