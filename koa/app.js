
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


//mysql操作
var mysql      = require('mysql');

var connection = mysql.createConnection({
    host     : '10.27.101.3',
    port: 3306,
    user     : 'devuser',
    password : 'devuser',
    database : 'vss'
});

var connectp = ()=>{
    return new Promise((resolve,reject)=>{
        connection.connect((err)=>{
            if(err)
                reject(err);
            resolve();
        });
    });
};

var queryp = (sql) =>{
    return new Promise((resolve,reject)=>{
        connection.query(sql,(err,rows)=>{
            if(err)
                reject(err);
            else
                resolve(rows);
        });
    });
};

var sql = 'SELECT count(0) as c from ue_advice';

function* mysqlTest(){
    yield connectp();
    var d = yield queryp(sql);
    return d[0].c;
    //var data;
    //connection.connect();
    //    connection.query(sql, function(err, rows, fields) {
    //    if (err) throw err;
    //    data = rows[0].c;
    //    console.log(rows[0].c);
    //});
    //connection.end();
    //return data;

};

app.use(route.get('/hello', function *(){
    var type = this.query.type;
    if(type ==1) {
        this.body = yield this.render('user', user);
    }else{
        this.redirect('/test');
    }
}));

app.use(route.get('/test',function *(){
    //console.log(this.query);
    //console.log(this.search);
    var a = yield mysqlTest();
    this.body = "get it:"+a;
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

