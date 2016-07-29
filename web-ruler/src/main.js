

var button = document.createElement('button');
button.innerText = "截图";
document.body.appendChild(button);

var ww = window.innerWidth;
var wh = document.body.clientHeight;

var getScreenShot = function () {
    chrome.runtime.sendMessage({ n: "sall" }, function (response) {
        console.log(response);
    });
}

getScreenShot();

button.addEventListener('click',getScreenShot);

var draw = require('./draw');
draw.init();

