var webpack = require('webpack');
var path = require('path');
var buildPath = path.resolve(__dirname, 'build');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
//var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');

var config = {
  //Entry points to the project
  entry: {
    app: path.join(__dirname, 'js/main.js')
  },
  //Config options on how to interpret requires imports
  resolve: {
    extensions: ["", ".js", ".jsx"]
    //node_modules: ["web_modules", "node_modules"]  (Default Settings)
  },
  //Server Configuration options
  devServer:{
    contentBase: '',  //Relative directory for base of server
    devtool: 'eval',
    hot: true,        //Live-reload
    inline: true,
    //host:'10.24.50.201',
    port: 4001        //Port Number
  },
  devtool: 'eval',
  output: {
    path: buildPath,    //Path of output file
    filename: '[name].js'
  },
  plugins: [
    //Enables Hot Modules Replacement
    new webpack.HotModuleReplacementPlugin(),
    //Allows error warnings but does not stop compiling. Will remove when eslint is added
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        //supresses warnings, usually from module minification
        warnings: false
      }
    }),
    new webpack.NoErrorsPlugin(),
    //new TransferWebpackPlugin([
    //  {from: 'html'}
    //], path.resolve(__dirname, "src")),
    //new ExtractTextPlugin('style.css', { allChunks: true })
  ],
  module: {
    loaders: [
       { test: /\.png$/ , loader :"file?name=[name].[ext]" },
       { test: /\.less$/, loader: "style!css!less!postcss" },
       //{ test: /\.html$/, loader: "tmodjs" },
       //{ test:/\.(png|woff|svg|ttf|eot)$/,loader:'url-loader?limit=10000'}
    ]
  },
  postcss: function () {
      return [autoprefixer];
  }
};

module.exports = config;
