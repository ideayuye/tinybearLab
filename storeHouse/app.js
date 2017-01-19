
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var serveStatic = require('serve-static');
var multiparty = require('multiparty');

app.use(bodyParser());
app.use(serveStatic('static'));

app.get('/log',(req,res)=>{
    var callback = req.query.callback||'callback';
    delete req.query.callback;
    fs.appendFileSync('static/logs.json',JSON.stringify(req.query)+'\r\n');
    res.send(callback+'({h:"hello"})');
});


app.post('/upload',(req,res)=>{
    var form = new multiparty.Form({uploadDir: './tempStore/'});
    form.parse(req, function(err, fields, files) {
        var upfile = files.upfile;
        var files = [];
        if (upfile instanceof  Array) {
            files = upfile;
        } else {
            files.push(upfile);
        }
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var path = file.path;
            var name = file.originalFilename;
            var target_path = "./tempStore/" + name;
            fs.rename(path, target_path, function (err) {
                if (err) throw err;
                fs.unlink(path,(err)=>{
                    console.log(err);
                });
            });
        }
    });

    res.send({ title:'Complete' });
})

app.listen(802);

