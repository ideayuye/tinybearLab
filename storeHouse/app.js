
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var serveStatic = require('serve-static')

app.use(bodyParser());
app.use(serveStatic('static'));


app.get('/log',(req,res)=>{
    var callback = req.query.callback||'callback';
    delete req.query.callback;
    fs.appendFileSync('static/logs.json',JSON.stringify(req.query)+'\r\n');
    res.send(callback+'({h:"hello"})');
});

app.listen(80);

