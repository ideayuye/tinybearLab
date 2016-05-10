
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
bird.on(Hilo.event.POINTER_START,function(e){
    console.log(e.eventTarget, e.stageX, e.stageY);
});


