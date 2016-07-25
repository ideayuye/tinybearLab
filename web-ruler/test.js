

chrome.browserAction.onClicked.addListener(function () {
    // chrome.tabs.create({url:"https://indus.site/"});

    chrome.tabs.executeScript(null, { file: 'content_script.js' }, function () {
        chrome.tabs.captureVisibleTab(function (screenshotUrl) {
            chrome.runtime.sendMessage(null, { n: "sall" }, function (response) {
                console.log(response);
            });
        });
    });
    chrome.tabs.insertCSS(null, { file: 'content.css' });


    chrome.tabs.query({ active: true }, function (tab) {
        // console.log(tab);
    });
    
});



