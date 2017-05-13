
var SkillTree = function(){

};

SkillTree.prototype.init= function(){

};


(()=>{
    var container = document.getElementById('skill_tree');

    var stage = new Hilo.Stage({
        renderType:'canvas',
        container: container,
        width: 720*0.5,
        height: 1280*0.5,
    });

    var bgWidth = 720*0.5;
    var bgHeight = 1280*0.5;
    var dom = Hilo.createElement('div', {
      id: 'bg',
      style: {
          position: 'absolute',
          background: 'url(images/bg.png) no-repeat',
          backgroundSize: 'cover',
          width: bgWidth + 'px',
          height: bgHeight + 'px'
      }
    });
    container.insertBefore(dom,stage.canvas);

    var ground = new Hilo.Bitmap({
      id: 'ground',
      image: 'images/bg.png'
    });
    ground.x =0;
    ground.y = 0;
    // ground.addTo(stage);

    var text = new Hilo.Text({
        color:'#f50',
        font:'simsun',
        text:'hello'
        
    }).addTo(stage);

    stage.enableDOMEvent(Hilo.event.POINTER_START, true);
    text.on(Hilo.event.POINTER_START, function (e) {
        console.log(e.eventTarget, e.stageX, e.stageY);
    });

    var ticker = new Hilo.Ticker(60);
    ticker.addTick(stage);
    ticker.start();

})();