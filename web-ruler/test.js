
 
chrome.browserAction.onClicked.addListener(function () {
    // chrome.desktopCapture.chooseDesktopMedia(["window"],
    //     chrome.tabs.create({url:""}),function (streamId) {
    //     console.log(streamId);
    // });

    // chrome.tabs.create({url:"https://indus.site/"});

    chrome.tabs.executeScript(null,{file:'content_script.js'});
    chrome.tabs.insertCSS(null,{file:'content.css'});
    
});



