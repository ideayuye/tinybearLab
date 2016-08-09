

//写入控制菜单
var menus = require('./html/menu.html');
var html = menus();
var container = document.createElement('div');
container.innerHTML=html;
document.body.appendChild(container);

var draw = require('./draw');
var zoom = require('./zoom');
var initDraw = function () {
    draw.init();
    var menuZI = document.querySelector('#menu_zoom_in');
    var menuZO = document.querySelector('#menu_zoom_out');
    var menuPan = document.querySelector('#menu_pan');

    menuZI.addEventListener('click', () => { zoom.zoomIn(); });
    menuZO.addEventListener('click', () => { zoom.zoomOut(); });
    menuPan.addEventListener('click', () => {
        if (draw.action == 1)
            draw.action = 2;
        else
            draw.action = 1;
    });

};

var getScreenShot = function () {
    chrome.runtime.sendMessage({ n: "sall" }, function (response) {
        console.log("screen ok");
        initDraw();
        draw.setScreenShotUrl(response);
        /*var img = document.createElement('img');
        img.setAttribute('src', response);
        document.body.appendChild(img);
        img.style.cssText= "position:fixed;top:0;left:0;"*/
    });
}

getScreenShot();







