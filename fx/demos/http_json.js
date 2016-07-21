
var http = require('http');

var server = http.createServer((req, res) => {

    if (req.url === "/json") {
        var json = "";
        req.on('data', (data) => {
            json += data;
        });

        req.on('end', (data) => {
            if(data)
                json += data;

            console.log(json);
            res.end('receive ok!');
        });
    }else{
        res.end('hi');
    }
});

console.log(server instanceof http.Server);

server.listen(1202);

/*
var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.src = "http://res.suning.cn/public/v3/js/jquery.js?201602250002";script.type = 'text/javascript';
head.appendChild(script);
*/

/*
$.post('/json',{ts:"fafa"},function(da){console.log(da);});
*/


