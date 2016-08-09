/**
 * Created by 15050971 on 2016/6/19.
 */

var http = require('http');
var qs = require('querystring');
var url = require('url');


var cookie = qs.stringify({"name":"bear"});

console.log(cookie);

var req = http.request({
    port:1111,
    host:'localhost',
    method:'GET',
    path:'/',
    headers:{
        'Set-Cookie':cookie
    }
},(res)=>{
    var body = "";
    res.on('data',(chunk)=>{
        body += chunk;
    });

    res.on('end',()=>{
        console.log(body);
    });
});

req.end();
console.log('end');

//var req = http.get("http://localhost:1111/",(res)=>{
//    var body = "";
//    res.on('data',(chunk)=>{
//        body += chunk;
//    });
//
//    res.on('end',()=>{
//        console.log("get:"+body);
//    });
//});

console.log(url.parse('/status?name=ryan',true).query);

