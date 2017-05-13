var path = require('path')
var webpack = require('webpack')

var baseConfig = {
    entry: ['babel-polyfill','./index.js'],
    // entry: ['./index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    plugins: [

    ],
    module: {
        rules: [{
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['es2015']
                    // plugins: ["transform-runtime"]
                }
            }
        }]
    }
}

module.exports = baseConfig;