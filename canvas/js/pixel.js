
var dom_c = document.getElementById('canvas_panel');
var cp = dom_c.getContext("2d");
var imgd = document.getElementById('r_img');

// var img = new Image(300,227);
// img.src="http://localhost:807/canvas/images/rhino.jpg";
// img.onload = function(){
// 	// cp.drawImage(imgd,0,0,300,227,0,0,300,227);
// 	// img.style.display = 'none';
// };

window.onload = function(){
	cp.drawImage(imgd,0,0);
	// cp.drawImage(imgd,0,0,imgd.width,imgd.height);
}

var pick  = function(event){
	var x = event.layerX;
	var y = event.layerY;
	var pixel = cp.getImageData(x,y,1,1);
	var data = pixel.data;
	var rgba = 'rgba(' + data[0] + ',' + data[1] +
             ',' + data[2] + ',' + data[3] + ')';
	console.log(rgba);
}

dom_c.addEventListener('click',pick);

var save = function(){
	console.log(dom_c.toDataURL('image/png'));
}

document.getElementById('btn_save').onclick = save;

