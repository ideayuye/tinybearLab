## WebPack系列知识介绍 ##

###概述###
Webpack是一款用户打包前端模块的工具。主要是用来打包在浏览器端使用的javascript的。同时也能转换、捆绑、打包其他的静态资源，包括css、image、font file、template等。这里就尽量详细的来介绍下一些基本功能的使用。

###安装###
    npm install webpack 

###运行webpack###
webpack需要编写一个config文件，然后根据这个文件来执行需要的打包功能。我们现在来编写一个最简单的config。新建一个文件，命名为webpack-config.js。config文件实际上就是一个Commonjs的模块。内容如下：

	var webpack = require('webpack');
	var path = require('path');
	var buildPath = path.resolve(__dirname,"build");
	var nodemodulesPath = path.resolve(__dirname,'node_modules');

	var config = {
		//入口文件配置
		entry:path.resolve(__dirname,'src/main.js')，
		resolve:{
			extentions:["","js"]//当requrie的模块找不到时，添加这些后缀
		},
		//文件导出的配置
		output:{
			path:buildPath,
			filename:"app.js"
		}
	}

	module.exports = config;

我的目录结构是这样的：
	
	webpack
		|---index.html
		|---webpack-config.js
		|---src
			 |---main.js
			 |---js
				  |---a.js

main.js文件内容如下：
	
	var a = require('./js/a');
	a();
	console.log('hello world');
	document.getElementById("container").innerHTML = "<p>hello world</p>";

a.js文件内容如下：

	module.exports = function(){
		console.log('it is a ');
	}


然后我们执行如下的命令：
	
	webpack --config webpack-config.js --colors


这样我们就能在目录里面看到一个新生成的目录build，目录结构如下：
	
	webpack
		|---index.html
		|---webpack-config.js
		|---build
			 |---app.js

然后引用app.js就Ok啦。main.js和模块a.js的内容就都打包到app.js中了。这就演示了一个最简单的把模块的js打包到一个文件的过程了。


###介绍webpack config文件###
接着我们来解释下config文件中的节点分别代表什么意思

- entry

配置要打包的文件的入口;可以配置多个入口文件，下面会有介绍。

- resolve
	
配置文件后缀名，除了js，还有jsx、coffee等等。除了这个功能还可以配置其他有用的功能，由于我还不完全了解，有知道的朋友欢迎指教。

- output
	
配置输出文件的路径，文件名等。

- module
	
配置要使用的loader。对文件进行一些相应的处理。比如babel-loader可以把es6的文件转换成es5。

一个module的例子:

	module: {
	    preLoaders: [
	      {
	        test: /\.(js|jsx)$/,
	        loader: 'eslint-loader',
	        include: [path.resolve(__dirname, "src/app")],
	        exclude: [nodeModulesPath]
	      },
	    ],
	    loaders: [
	      {
	        test: /\.(js|jsx)$/, //正则表达式匹配 .js 和 .jsx 文件
	        loader: 'babel-loader?optional=runtime&stage=0',//对匹配的文件进行处理的loader 
	        exclude: [nodeModulesPath]//排除node module中的文件
	      }
	    ]
    }

- plugins
	
顾名思义，就是配置要使用的插件。不过plugin和loader有什么差别还有待研究。
来看一个使用plugin的例子：

	plugins: [
	    //压缩打包的文件
	    new webpack.optimize.UglifyJsPlugin({
	      compress: {
	        //supresses warnings, usually from module minification
	        warnings: false
	      }
	    }),
	    //允许错误不打断程序
	    new webpack.NoErrorsPlugin(),
	    //把指定文件夹xia的文件复制到指定的目录
	    new TransferWebpackPlugin([
	      {from: 'www'}
	    ], path.resolve(__dirname,"src"))
  	]

一个config文件，基本都是由这几个配置项组成的。

### 如何压缩输出的文件 ###

	plugins: [
	    //压缩打包的文件
	    new webpack.optimize.UglifyJsPlugin({
	      compress: {
	        //supresses warnings, usually from module minification
	        warnings: false
	      }
	    })]


### 如何copy目录下的文件到输出目录 ###

	plugins: [
	    //把指定文件夹下的文件复制到指定的目录
	    new TransferWebpackPlugin([
	      {from: 'www'}
	    ], path.resolve(__dirname,"src"))
  	]

###配置loader###
大部分的对文件的处理的功能都是通过loader实现的。

- 安装loader

- 配置loader

目前已有的loader列表：
[https://webpack.github.io/docs/list-of-loaders.html](https://webpack.github.io/docs/list-of-loaders.html "目前已有的loader列表")


###打包javascript模块###
支持的js模块化方案包括：

- ES6 模块

	import MyModule from './MyModule.js';

- CommonJS 
	
	var MyModule = require('./MyModule.js');

- AMD
 
	define(['./MyModule.js'], function (MyModule) {
	});

上面已经演示了打包js模块,这里不再重复。ES6的模块需要配置babel-loader来先把处理一下js文件。
下面展示下打包ES模块的配置文件:
	
	var webpack = require('webpack');
	var path = require('path');
	var buildPath = path.resolve(__dirname, 'build');
	var nodeModulesPath = path.resolve(__dirname, 'node_modules');
	var TransferWebpackPlugin = require('transfer-webpack-plugin');
	
	var config = {
	  entry: [path.join(__dirname, 'src/main.js')],
	  resolve: {
	    extensions: ["", ".js", ".jsx"]
	    //node_modules: ["web_modules", "node_modules"]  (Default Settings)
	  },
	  output: {
	    path: buildPath,    
	    filename: 'app.js'  
	  },
	  plugins: [
	    new webpack.optimize.UglifyJsPlugin({
	      compress: {
	        warnings: false
	      }
	    }),
	    new webpack.NoErrorsPlugin(),
	    new TransferWebpackPlugin([
	      {from: 'www'}
	    ], path.resolve(__dirname,"src"))
	  ],
	  module: {
	    preLoaders: [
	      {
	        test: /\.(js|jsx)$/,
	        loader: 'eslint-loader',
	        include: [path.resolve(__dirname, "src/app")],
	        exclude: [nodeModulesPath]
	      },
	    ],
	    loaders: [
	      {
	        test: /\.js$/, //注意是正则表达式，不要加引号
	        loader: 'babel-loader?optional=runtime&stage=0',//babel模块相关的功能请自查，这里不做介绍
	        exclude: [nodeModulesPath]
	      }
	    ]
	  },
	  //Eslint config
	  eslint: {
	    configFile: '.eslintrc' //Rules for eslint
	  },
	};

	module.exports = config;
	

### 打包静态资源 ###
- css/sass/less
安装css-loader和style-loader
	
	npm install css-loader --save -dev
	npm install style-loader --save -dev

config配置：
	
	var config = {
		entry:path.resolve(__dirname,'src/main.js'),
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
				loader:'style!css',//
				exclude:nodemodulesPath
			}]
		}
	}

style-loader会把css文件嵌入到html的style标签里，css-loader会把css里@import的文件导入进来。打包完成的文件，引用执行后，会发现css的内容都插入到了head里的一个style标签里。

- images
可以通过url-loader把较小的图片转换成base64的字符串内嵌在生成的文件里。
安装：
	
	npm install url-loader --save -dev

config配置:
	var config = {
		entry:path.resolve(__dirname,'src/main.js'),
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
				loader:'style!css',//
				exclude:nodemodulesPath
			},
			{ test:/\.png$/,loader:'url-loader?limit=10000'}//限制大小小于10k的
			]
		}
	}

css文件内容：
	
	#container{
		color: #f00;
		background:url(images/logo-201305.png);
		/*生成完图片会被处理成base64的字符串 注意：不要写'/images/logo-201305.png',否则图片不被处理*/
	}

- iconfont
内嵌iconfont的使用方法其实和上述处理png图片的方法一致。通过url-loader来处理。

config配置：
	
	var config = {
		entry:path.resolve(__dirname,'src/main.js'),
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
				loader:'style!css',//
				exclude:nodemodulesPath
			},
			{ test:/\.(png|woff|svg|ttf|eot)$/,loader:'url-loader?limit=10000'}//限制大小小于10k的
			]
		}
	}

css文件内容：
	
	@font-face {font-family: 'iconfont';
    src: url('fonts/iconfont.eot'); /* IE9*/
    src: url('fonts/iconfont.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
    url('fonts/iconfont.woff') format('woff'), /* chrome、firefox */
    url('fonts/iconfont.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
    url('fonts/iconfont.svg#iconfont') format('svg'); /* iOS 4.1- */
	}

执行打包后会把字体文件都转换成base64字符串内容到文件里.
这里有个头疼的问题，就是每个浏览器支持的字体格式不一样，由于把全部格式的字体打包进去，造成不必要的资源浪费。

###打包template###
我一大包handlebars的模块为例，来演示下打包模块的过程。有的模板对应的loader，有可能没有现车的，恐怕要自己实现loader。

先安装必须的node模块

	npm install handlebars-loader --save -dev
	npm install handlebars -save//是必须的

config配置:
	
	var config = {
		entry:path.resolve(__dirname,'src/main.js'),
		resolve:{
			extentions:["","js"]
		},
		output:{
			path:buildPath,
			filename:"app.js"
		},
		module:{
			loaders:[
			{ test: /\.html$/, loader: "handlebars-loader" }
			]
		}
	}

新建一个模板文件tb.html，目录结构：

	webpack
		|---index.html
		|---webpack-config.js
		|---src
			 |---template
			 |	 	|---tb.html
			 |---main.js

main.js中调用模块的代码如下：
	
	var template = require("./template/tp.html");
	var data={say_hello:"it is handlebars"};
	var html = template(data);
	document.getElementById('tmpl_container').innerHTML = html; 		

###公用的模块分开打包###



###多个入口####
config配置：

	var config = {	
		entry:{
			m1:path.resolve(__dirname,'src/main.js'),
		 	m2:path.resolve(__dirname,'src/main1.js')
		},//注意在这里添加文件的入口
		resolve:{
			extentions:["","js"]
		},
		output:{
			path:buildPath,
			filename:"[name].js"//注意这里使用了name变量
		}	
	}

###webpack-dev-server###



###webpack plugin 开发###
待完善


###webpack loader 开发###
待完善













