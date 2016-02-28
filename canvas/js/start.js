

var dom_c = document.getElementById('canvas_panel');
var cp = dom_c.getContext("2d");


var player = {
  color: "#000",
  x: 50,
  y: 50,
  width: 32,
  height: 32,
  draw: function() {
    cp.fillStyle = this.color;
    // cp.fillRect(this.x, this.y, this.width, this.height);
    cp.fillText("一只熊",this.x,this.y);
  }
};

var update = function(){
	  if (keydown.left) {
		  player.x -= 2;
	  }
	
	  if (keydown.right) {
		  player.x += 2;
	  }
};

var draw = function(){
	cp.clearRect(0,0,dom_c.width,dom_c.height);
	player.draw();
};

var FPS = 10;
setInterval(function() {
  update();
  draw();
}, 1000/FPS);
