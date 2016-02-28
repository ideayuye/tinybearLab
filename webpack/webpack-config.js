
var webpack = require('webpack');
var path = require('path');
var buildPath = path.resolve(__dirname,"build");
var nodemodulesPath = path.resolve(__dirname,'node_modules');
var pathToHandlebars = path.resolve(nodemodulesPath, 'handlebars/dist/handlebars.min.js');

var config = {
	// entry:{app:path.resolve(__dirname,'src/main.js'),vendor: ["./src/js/common"]},
	entry:{m1:path.resolve(__dirname,'src/main.js')},
	// 	m2:path.resolve(__dirname,'src/main1.js')},
	resolve:{
		extentions:["","js"],
		// alias:{
		// 	'handlebars':pathToHandlebars
		// }
	},
	output:{
		path:buildPath,
		filename:"app.js"
	}
	// module:{
	// 	loaders:[{
	// 		test:/\.css$/,
	// 		loader:'style!css',
	// 		exclude:nodemodulesPath
	// 	},
	// 	{ test:/\.(png|woff|svg|ttf|eot)$/,loader:'url-loader?limit=10000'},
	// 	{ test: /\.jpg$/, loader: "file-loader?name=[sha512:hash:base64:7].[ext]" },
	// 	{ test: /\.html$/, loader: "handlebars-loader" }
	// 	]
	// },
	// plugins:[
	// 	// new webpack.optimize.UglifyJsPlugin({
	// 	//     compress: {
	// 	//        //supresses warnings, usually from module minification
	// 	//        warnings: false
	// 	//     }
	// 	// }),
	// 	new webpack.optimize.CommonsChunkPlugin({
	// 		name: "vendor",
	// 		// (the commons chunk name)
	// 		filename: "vendor.js",
	// 		// (the filename of the commons chunk)

	// 		// minChunks: 3,
	// 		// (Modules must be shared between 3 entries)

	// 		// chunks: ["pageA", "pageB"],
	// 		// (Only use these entries)
	// 	})
	// ]
	
}

module.exports = config;
