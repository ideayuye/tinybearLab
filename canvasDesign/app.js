/**
 * Created by tinybear on 2016/4/4.
 */

var koa     = require('koa');
var app     = koa();
var route   = require('koa-route');
var static = require('koa-static');
var views   = require('koa-arttemplate');
var render  = views();

app.use(static(__dirname+'/views'));

app.use(route.get('/',function*(){
    this.body = yield render('index');
}));

app.listen(2000);
console.log('listen 2000');


