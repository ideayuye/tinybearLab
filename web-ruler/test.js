
// alert("are you ok");
// window.opne('http://indus.site');
 
alert( chrome.runtime.getURL());

var tab = chrome.tabs.query({'active': true}); //WRONG!!!
chrome.tabs.update(tab.id, {url:newUrl});
