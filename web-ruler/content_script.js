
// document.body.style.background = "green";

var sayHello = function (someone) {
    console.log(someone + ":say hello");
}

sayHello("xl");

var getScreenShot = function () {
    chrome.runtime.sendMessage(null, { n: "sall" }, function (response) {
        console.log("response");
    });
}

getScreenShot();

