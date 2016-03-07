
var co = require('co');
var render = require('co-render');

var tobi = {
  name: 'tobi',
  species: 'ferret'
};

var html = render('user.html', { hello: tobi, engine: 'xtemplate' });
console.log(html);

//co(function *(){
//  var html = yield render('user.html', { hello: tobi, engine: 'art-template' });
//  console.log(html);
//}).then(()=>{
//    console.log(1);
//},()=>{
//    console.log(2);
//}).catch((e)=>{
//    console.log(e);
//});
