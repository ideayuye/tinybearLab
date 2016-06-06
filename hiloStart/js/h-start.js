//准备舞台
var containerElem = document.getElementById('container');

var stage = new Hilo.Stage({
    renderType:'canvas',
    container:containerElem,
    width:320,
    height:480
});

var ticker = new Hilo.Ticker(60);
ticker.addTick(stage);
ticker.start();

var bird = new Hilo.Bitmap({
    image:'images/lion.png'
}).addTo(stage);

stage.enableDOMEvent(Hilo.event.POINTER_START,true);
//bird.on(Hilo.event.POINTER_START,function(e){
//    console.log(e.eventTarget, e.stageX, e.stageY);
//});

//加载资源
var queue = new Hilo.LoadQueue();
queue.maxConnections = 3;
queue.add({id:'bg',src:'images/bg.png'});
queue.add({id:'bird',src:'images/bird.png'});
queue.add({id:'ground',src:'images/ground.png'});
queue.add({id:'holdback',src:'images/holdback.png'});
queue.add({id:'number',src:'images/number.png'});
queue.add({id:'over',src:'images/over.png'});
queue.add({id:'ready',src:'images/ready.png'});

queue.on('load',function(e){
    console.log('load',e.detail);
});

queue.on('error',function(){
    console.log('error',e.detail);
});

queue.on('complete',function(){
    console.log('complete',queue.getLoaded());
    addFirstScene();
});

queue.start();

//添加第一个场景
var addFirstScene = function(){
    var bg = new Hilo.Bitmap(queue.getContent('bg'));
    bg.width=320;
    bg.height=480;
    bg.addTo(stage);
    
};

