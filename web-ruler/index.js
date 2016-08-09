

chrome.browserAction.onClicked.addListener(function () {
    // chrome.tabs.create({url:"https://indus.site/"});

    chrome.tabs.insertCSS(null, { file: 'content.css' }, function () {
        chrome.tabs.executeScript(null, { file: 'content_script.js' }, function () {

        });
    });

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        chrome.tabs.captureVisibleTab({format:'png'},function (screenshotUrl) {
            sendResponse(screenshotUrl );
        });
        return true;
    });

});



