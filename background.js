

function doCreateGroup(callback) {

}

function setPopup() {
    chrome.browserAction.setPopup({
        popup: ""
    }), chrome.browserAction.setBadgeText({
        text: ""
    }), chrome.browserAction.setIcon({
        path: "sendme.png"
    }), chrome.browserAction.setTitle({
        title: chrome.i18n.getMessage("AppIconTitle")
    }), chrome.browserAction.onClicked.addListener(l), q()
}

function setPopupWellcome() {
    chrome.browserAction.setPopup({
        popup: "popup.html"
    }), chrome.browserAction.setIcon({
        path: "sendme_disabled.png"
    }), chrome.browserAction.setBadgeText({
        text: "ID !"
    })
}

function alreadyConfigured() {

}

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if ("createGroup" == request.msg) {
        localStorage.telegram_bot_token = request.bot_id;
        localStorage.telegram_group_name = request.groupName;

        function do_query() {
            xhr = new XMLHttpRequest();
            var url = telegramApi_URL + request.bot_id + "/getUpdates";
            xhr.open("GET", url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var json = JSON.parse(xhr.responseText);
                    json.result.forEach(function (item) {
                        if (item.message.chat.first_name == request.groupName) {
                            localStorage.telegram_group_id = item.message.chat.id;
                        }
                    });
                    if (localStorage.telegram_group_id) {
                        alreadyConfigured();
                    } else {
                        setTimeout(function () { do_query() }, 10000);
                    }
                }
            }
            xhr.send();
        }
    } else if ("configured" == request.msg) {
        alreadyConfigured();
    }
        
    /*var xhr = new XMLHttpRequest();
    xhr.open("POST", telegramApi_URL, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json);
        }
    }
    var data = JSON.stringify({  });
    xhr.send(data);*/
}
    /*if ("getUserID" == request.msg && d(), "getUserIDcountdown" == a.msg && e(), "getNaviLink" == a.msg) {
        console.dir(a);
        var g = "yandexnavi://build_route_on_map?lat_to=" + a.lat + "&lon_to=" + a.lon,
            h = chrome.i18n.getMessage("naviLinkTitle");
        f(h + a.pointname + "\r\n" + g)
    }
    "initApp" == a.msg && o(), "welcomeInstall" == a.msg && p()*/
})

var test_bot_id = 186718542:AAE38mXwxSRPw95m89Vbx1b4NMvOkuU4GuQ;
var telegramApi_URL = "https://api.telegram.org/";

window.console || (window.console = {
    log: function () { },
    dir: function () { }
}), console.log("background.js engaged!");

localStorage.telegram_bot_token ? (console.log("boot id is: " + localStorage.telegram_bot_token), setPopup()) : setPopupWellcome();