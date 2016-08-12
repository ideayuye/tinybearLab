


var Mousetrap = require('./libs/mousetrap.js');
var draw = require('./draw');

Mousetrap.bind(['alt+='], function() { 
    console.log('4');
    return;
 });
 Mousetrap.bind(['alt+-'], function() { 
    console.log('5');
    return;
 });

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
    var menuZI = document.querySelector('#menu_zoom_in');
    var menuZO = document.querySelector('#menu_zoom_out');
    var menuPan = document.querySelector('#menu_pan');
    var menuSelect = document.querySelector("#menu_select");
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
    }

    var measure = function(e){
        draw.action = 1;
        var menu = e.target;
        lightMenu(menu);
    }

    menuZI.addEventListener('click', draw.zoomIn);
    menuZO.addEventListener('click', draw.zoomOut);
    menuPan.addEventListener('click', pan);
    menuMeasure.addEventListener('click',measure);

    //绑定快捷键
    Mousetrap.bind('alt+=', draw.zoomIn);
    Mousetrap.bind('alt+-', draw.zoomOut);
    Mousetrap.bind('alt+h', ()=>{ menuPan.click();});
    Mousetrap.bind('alt+m', ()=>{ menuMeasure.click();});

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







