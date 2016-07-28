

var button = document.createElement('button');
button.innerText = "截图";
document.body.appendChild(button);

var getScreenShot = function () {
    chrome.runtime.sendMessage({ n: "sall" }, function (response) {
        console.log(response);
    });
}

getScreenShot();

button.addEventListener('click',getScreenShot);

var dw = require('./draw.js');

dw.init();


