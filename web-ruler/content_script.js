
// document.body.style.background = "green";
console.log('hello');

var sayHello = function (someone) {
    console.log(someone + ":say hello");
}

sayHello("xl");

// var test = function () {

// }

// test();

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    alert(message);
    sendResponse('ok');
});