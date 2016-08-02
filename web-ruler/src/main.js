

/*var button = document.createElement('button');
button.innerText = "截图";
document.body.appendChild(button);
button.addEventListener('click',getScreenShot);*/

//写入控制菜单
var menus = require('./html/menu.html');
var html = menus();
var container = document.createElement('div');
container.innerHTML=html;
document.body.appendChild(container);

var draw = require('./draw');
draw.init();
var zoom = require('./zoom');

var getScreenShot = function () {
    chrome.runtime.sendMessage({ n: "sall" }, function (response) {
        console.log("screen ok");
        // screenShotUrl = response;
        draw.setScreenShotUrl(response);
    });
}

getScreenShot();

var menuZI =  document.querySelector('#menu_zoom_in');
var menuZO = document.querySelector('#menu_zoom_out');

menuZI.addEventListener('click',()=>{zoom.zoomIn();});
menuZO.addEventListener('click',()=>{zoom.zoomOut();});

