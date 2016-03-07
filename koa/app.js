
var koa = require('koa');
var route = require('koa-route');
var parse = require('co-body');
var app = koa();

var xtpl = require('xtpl/lib/koa');
//xtemplate模板渲染
xtpl(app,{
    //配置模板目录，指向工程的view目录
    views: __dirname + '/views'
});

// logger
app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

var user = {
    hello:"hi"
};

app.use(route.get('/hello', function *(){
    this.body = yield this.render('user',user);
}));

app.use(route.get('/test',function *(){
    console.log(this.query);
    console.log(this.search);

    this.body = "get it";
}));

app.use(route.post('/post',function*(){
    var post = yield parse(this);
    console.log(post);
    this.body = "post ok";
}));

// response
//app.use(function *(){
//  this.body = 'Hello World';
//});

app.listen(8666);
console.log("listen in 8666");

