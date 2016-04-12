
function iconClicked() {
    console.log("icon clicked");
    chrome.browserAction.setIcon({
        path: "truck_disabled.png"
    });
    setTimeout(function () {
        chrome.browserAction.setIcon({
            path: "truck.png"
        });
    }, 100);
    chrome.tabs.getSelected(null, function (tab) {
        console.log(tab);
        var url = tab.url;
        if (url.indexOf("https://www.google.es/maps") != -1) {
            var address;
            if (url.indexOf("https://www.google.es/maps/dir") != -1) {
                //dir
                address = url.split('/')[6];
            } else {
                //place
                address = url.split('/')[5];
            }
            var originUrl;
            if (localStorage.telegram_origin && localStorage.telegram_origin !== '') {
                originUrl = getOriginToURL(url, localStorage.telegram_origin);
                chrome.tabs.update(tab.id, { url: originUrl });
            }
            doGetCoords(address, function (address_txt, coords) {
                doSendPosition(address_txt, coords, originUrl, function () {
                    chrome.browserAction.setIcon({
                        path: "truck.png"
                    });
                });
            });
        }
    });
}

function doGetCoords(address, callback) {
    var xhr = new XMLHttpRequest();
    var url = googleMapsApi_URL + "geocode/json?address=" + address;
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var json = JSON.parse(xhr.responseText);
            if (callback) callback(json.results[0].formatted_address, json.results[0].geometry.location);
        }
    };
    xhr.send();
}

function doSetRouteOriginButton(message_id, url, callback) {
    var bot_token = localStorage.telegram_bot_token;
    var chat_id = localStorage.telegram_group_id;
    var keyboard = { 'inline_keyboard': [] };
    keyboard.inline_keyboard[0] = [];
    var button = { 'text': 'Ruta des de Origen', 'url': url };
    keyboard.inline_keyboard[0].push(button);
    setReplyKeyBoardButton(bot_token, chat_id, message_id, keyboard, callback);
}

function doSendPosition(address_txt, pos, originUrl, callback) {
    var bot_token = localStorage.telegram_bot_token;
    var chat_id = localStorage.telegram_group_id;
    var lat = pos.lat;
    var lng = pos.lng;
    sendMessage(bot_token, chat_id, address_txt, function () {
        sendLocation(bot_token, chat_id, lat, lng, function (message_id) {
            if (originUrl && localStorage.telegram_send_ruta == 'true') {
                doSetRouteOriginButton(message_id, originUrl, callback);
            }
        });
    });
}

function getOriginToURL(url, origin) {
    var splt = url.split('/');
    if(splt[4] == 'place'){
        splt[4] = 'dir';
        splt.splice(5, 0, encodeURIComponent(origin));    
    }
    var finalURL = splt.join('/');
    //return finalURL.split('data')[0];
    return finalURL;
}


function setReplyKeyBoardButton(bot_token, chat_id, message_id, keyboard, callback) {
    var xhr = new XMLHttpRequest();
    var url = telegramApi_URL + "bot" + bot_token + "/editMessageReplyMarkup";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json);
            if (callback) callback();
        }
    };
    var data = JSON.stringify({ 'chat_id': chat_id, 'message_id': message_id, 'reply_markup': keyboard });
    console.log(data);
    xhr.send(data);
}

function sendLocation(bot_token, chat_id, lat, lng, callback) {
    var xhr = new XMLHttpRequest();
    var url = telegramApi_URL + "bot" + bot_token + "/sendLocation";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json);
            if (callback) callback(json.result.message_id);
        }
    };
    var data = JSON.stringify({ 'chat_id': chat_id, 'latitude': lat, 'longitude': lng });
    console.log(data);
    xhr.send(data);
}

function sendMessage(bot_token, chat_id, txt, callback) {
    var xhr = new XMLHttpRequest();
    var url = telegramApi_URL + "bot" + bot_token + "/sendMessage";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json);
            if (callback) callback(json.result.message_id);
        }
    };
    var data = JSON.stringify({ 'chat_id': chat_id, 'text': txt });
    console.log(data);
    xhr.send(data);
}

function setPopup() {
    chrome.browserAction.setPopup({
        popup: ""
    });
    chrome.browserAction.setBadgeText({
        text: ""
    });
    chrome.browserAction.setIcon({
        path: "truck.png"
    });
    chrome.browserAction.setTitle({
        title: 'PosicioTelegram'
    });
    chrome.browserAction.onClicked.addListener(iconClicked);
}

function setPopupWellcome() {
    chrome.browserAction.setPopup({
        popup: "popup.html"
    });
    chrome.browserAction.setIcon({
        path: "truck_disabled.png"
    });
    chrome.browserAction.setBadgeText({
        text: "ID !"
    });
}


function alreadyConfigured() {
    console.log("alreadyConfigured. token " + localStorage.telegram_bot_token + " groupName " + localStorage.telegram_group_name + " groupId " + localStorage.telegram_group_id);
    setPopup();
}

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if ("createGroup" == request.msg) {
        localStorage.telegram_bot_token = request.bot_id;
        localStorage.telegram_group_name = request.groupName;
        if (request.origin && request.origin !== '') localStorage.telegram_origin = request.origin;
        function do_query(retry) {
            if (!retry) retry = 0;
            if (retry < 10) {
                xhr = new XMLHttpRequest();
                var url = telegramApi_URL + "bot" + request.bot_id + "/getUpdates";
                console.log("Query retry " + retry + " to " + url);
                xhr.open("GET", url, true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        var json = JSON.parse(xhr.responseText);
                        console.log("Query Result: ");
                        console.log(json);
                        json.result.forEach(function (item) {
                            if (item.message.chat.title == request.groupName) {
                                localStorage.telegram_group_id = item.message.chat.id;
                            }
                        });
                        if (localStorage.telegram_group_id) {
                            alreadyConfigured();
                            chrome.extension.sendMessage({ status: 'configured_ok' });
                        } else {
                            setTimeout(function () { do_query(retry + 1); }, 10000);
                        }
                    }
                };
                xhr.send();
            } else {
                chrome.extension.sendMessage({ status: 'configured_failed' });
            }
        }
        do_query();

    } else if ("configured" == request.msg) {
        alreadyConfigured();
        sendResponse({ status: 'ok' });
    } else if ("reset" == request.msg) {
        setPopupWellcome();
        sendResponse({ status: 'ok' });
    }

});

var telegramApi_URL = "https://api.telegram.org/";
var googleMapsApi_URL = "https://maps.googleapis.com/maps/api/";

window.console || (window.console = {
    log: function () { },
    dir: function () { }
});
console.log("background.js engaged!");

localStorage.telegram_bot_token && localStorage.telegram_group_id ? (console.log("alreadyConfigured. token " + localStorage.telegram_bot_token + " groupName " + localStorage.telegram_group_name + " groupId " + localStorage.telegram_group_id), setPopup()) : setPopupWellcome();