var koa = require('koa');
var app = koa();
var serve = require('koa-static');

app.use(serve(__dirname+'/../svg'));
app.use(serve(__dirname+'/../waterRipple'));


app.listen(3008);
console.log('listen 3008');
