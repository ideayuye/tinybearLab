
 
chrome.browserAction.onClicked.addListener(function () {
    // window.opne('http://indus.site');
    chrome.desktopCapture.chooseDesktopMedia(["window"],
        chrome.tabs.create({url:""}),function (streamId) {
        console.log(streamId);
    });

    chrome.tabs.create({url:"https://indus.site/"});

});

// var tab = chrome.tabs.query({'active': true}); //WRONG!!!
// chrome.tabs.update(tab.id, {url:newUrl});
