

chrome.browserAction.onClicked.addListener(function () {
    // chrome.tabs.create({url:"https://indus.site/"});

    chrome.tabs.executeScript(null, { file: 'content_script.js' }, function () {
    });
    chrome.tabs.insertCSS(null, { file: 'content.css' });

    chrome.tabs.query({ active: true }, function (tab) {
        // console.log(tab);
    });

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        chrome.tabs.captureVisibleTab(function (screenshotUrl) {
            sendResponse({"words":'screen ok'});
        });
        return true;
    });
    
});



