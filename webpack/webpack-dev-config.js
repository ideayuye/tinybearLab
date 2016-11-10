
var webpack = require('webpack');
var path = require('path');
var buildPath = path.resolve(__dirname,"build");
var nodemodulesPath = path.resolve(__dirname,'node_modules');

var config = {
	entry:[
		// 'webpack/hot/poll?1000',
		'webpack-dev-server/client?http://localhost:3005',//资源服务器地址
    	'webpack/hot/only-dev-server',
		path.resolve(__dirname,'src/main1.js')
	],
	// entry:{m1:path.resolve(__dirname,'src/main.js'),
	// 	m2:path.resolve(__dirname,'src/main1.js')},
	resolve:{
		extentions:["","js"]
	},
	// target: 'node',
	//Server Configuration options
    devServer:{
	    contentBase: '',  //Relative directory for base of server
	    devtool: 'eval',
	    hot: true,        //Live-reload
	    inline: true,
	    port: 3005        //Port Number
    },
    devtool: 'eval',
	output:{
		path:buildPath,
		filename:"app.js"
	},
	plugins: [
	    //Enables Hot Modules Replacement
	    new webpack.HotModuleReplacementPlugin(),
	    //Allows error warnings but does not stop compiling. Will remove when eslint is added
	    new webpack.NoErrorsPlugin()
	    //Moves files
	    // new TransferWebpackPlugin([
	    //   {from: ''}
    	// ], path.resolve(__dirname, "src"))
    ],
	module:{
		loaders:[{
			test:/\.css$/,
			loader:'style!css',
			exclude:nodemodulesPath
		},
		{ test:/\.(png|woff|svg|ttf|eot)$/,loader:'url-loader?limit=100000'},
		{ test: /\.jpg$/, loader: "file-loader?name=[sha512:hash:base64:7].[ext]" },
		{ test: /\.html$/, loader: "handlebars-loader" }
		]
	}
}

module.exports = config;
