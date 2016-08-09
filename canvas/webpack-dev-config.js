
var webpack = require('webpack');
var path = require('path');
var buildPath = path.resolve(__dirname,"build");
var nodemodulesPath = path.resolve(__dirname,'node_modules');

var config = {
	entry:path.resolve(__dirname,'js/lion.js'),
	resolve:{
		extentions:["","js"]
	},
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
    ]
}

module.exports = config;
