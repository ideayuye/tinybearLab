


var Mousetrap = require('./libs/mousetrap.js');
var draw = require('./draw');

var $ = require('jquery');

// $(window).on('keydown',function(e){
//     console.log(e);
// });


var initDraw = function () {
    document.body.appendChild(container);
    draw.init();
    bindMenu();
};

//写入控制菜单
var menus = require('./html/menu.html');
var html = menus();
var container = document.createElement('div');
    container.innerHTML=html;


//绑定菜单事件
var bindMenu =function(){
    var $rulerPanel = $('#ruler-panel');
    var menuZI = document.querySelector('#menu_zoom_in');
    var menuZO = document.querySelector('#menu_zoom_out');
    var menuPan = document.querySelector('#menu_pan');
    var menuMeasure = document.querySelector("#menu_measure");

    var lightMenu = function(menu){
        var  list = document.querySelectorAll('#TMK_menus li');
        for (var i = 0; i < list.length; i++) {
            var m = list.item(i);
            m.removeAttribute('class');          
        }
        menu.setAttribute('class','current');
    };

    var pan = function(e){
        draw.action = 2;
        var menu = e.target;
        lightMenu(menu);
        $rulerPanel.removeAttr('class').addClass('pan');
    }

    var measure = function(e){
        draw.action = 1;
        var menu = e.target;
        lightMenu(menu);
        $rulerPanel.removeAttr('class');
    }

    menuZI.addEventListener('click', draw.zoomIn);
    menuZO.addEventListener('click', draw.zoomOut);
    menuPan.addEventListener('click', pan);
    menuMeasure.addEventListener('click',measure);

    //绑定快捷键
    Mousetrap.bind('alt+=', draw.zoomIn);
    Mousetrap.bind('alt+-', draw.zoomOut);
    Mousetrap.bind('h', ()=>{ menuPan.click();});
    Mousetrap.bind('m', ()=>{ menuMeasure.click();});
    Mousetrap.bind(['backspace','del'],()=>{
        draw.deletePath();
    });

};

var getScreenShot = function () {
    chrome.runtime.sendMessage({ n: "sall" }, function (response) {
        initDraw();
        draw.setScreenShotUrl(response);
        /*var img = document.createElement('img');
        img.setAttribute('src', response);
        document.body.appendChild(img);
        img.style.cssText= "position:fixed;top:0;left:0;"*/
    });
}

getScreenShot();







