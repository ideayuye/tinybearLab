

var button = document.createElement('button');
button.innerText = "截图";
document.body.appendChild(button);

var ww = window.innerWidth;
var wh = document.body.clientHeight;

var canvas = document.createElement('canvas');
canvas.setAttribute('id','ruler-panel');
canvas.setAttribute('width',ww);
canvas.setAttribute('height',wh);
document.body.appendChild(canvas);
var ctx = canvas.getContext('2d');

ctx.beginPath();
ctx.lineWidth =1;
ctx.strokeStyle = 'red';
ctx.moveTo(100,200);
ctx.lineTo(200,200);
ctx.stroke();

var getScreenShot = function () {
    chrome.runtime.sendMessage({ n: "sall" }, function (response) {
        console.log(response);
    });
}

getScreenShot();

button.addEventListener('click',getScreenShot);


