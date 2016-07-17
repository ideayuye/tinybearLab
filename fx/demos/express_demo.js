
var express = require('express');
var app = express();


var hello = "";
//应用级中间件
app.use(function (req,res,next) {
    hello += "all\r\n";
    next();
});

app.get('/app',function (req,res,next) {
    hello += "get";
    res.end(hello);
});

//路由级中间件
var router = express.Router();
router.use('/get1',function (req,res,next) {
    res.end('from router1 get1');
});

router.use('/get2',(req,res,next)=>{
    res.send('from router1 get2');
});

app.use('/router1',router);

//错误处理中间件
app.use('/err',(req,res)=>{
    throw "it is err";
});

app.use((err,req,res,next)=>{
    console.log('err middleware:'+err);
    res.status(500).send('Something broke!');
});


app.listen(1088);

console.log('start');
