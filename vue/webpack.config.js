
const path = require('path')
const webpack = require('webpack')

module.exports = {

  devtool: 'inline-source-map',

  entry: ['./js/vuexLab/main.js'],

  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    // chunkFilename: '[id].chunk.js',
    // publicPath: '/__build__/'
  },

  module: {
      loaders: [
          {
              test: /\.js$/, exclude: /node_modules/, loader: 'babel'
          },
          { test: /\.vue$/, loader: 'vue' }
      ]
  },


  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin()
  ]

}
