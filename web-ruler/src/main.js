

var button = document.createElement('button');
button.innerText = "截图";
document.body.appendChild(button);

var draw = require('./draw');
draw.init();

var getScreenShot = function () {
    chrome.runtime.sendMessage({ n: "sall" }, function (response) {
        console.log("screen ok");
        // screenShotUrl = response;
        draw.setScreenShotUrl(response);
    });
}

getScreenShot();

button.addEventListener('click',getScreenShot);

