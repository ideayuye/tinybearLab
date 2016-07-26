
// document.body.style.background = "green";

var button = document.createElement('button');
button.innerText = "截图";
document.body.appendChild(button);

var sayHello = function (someone) {
    console.log(someone + ":say hello");
}

sayHello("xl");

var getScreenShot = function () {
    chrome.runtime.sendMessage({ n: "sall" }, function (response) {
        console.log(response);
    });
}

getScreenShot();

button.addEventListener('click',getScreenShot);

