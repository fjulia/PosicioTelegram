//	Extension author: Alexander Us
//	info@alexandr.us
function a() {
    _gaq.push(["_trackEvent", "sendMessage", "message"])
}

function b() {
    for (var a = 15, b = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", c = "", d = 0, e = b.length; a > d; ++d) c += b.charAt(Math.floor(Math.random() * e));
    return chrome.i18n.getUILanguage() + c
}

function c(a) {
    "valid" == a ? (console.log("telegram used id: " + a), localStorage.telegram_user_id = a, chrome.runtime.sendMessage({
        status: "ok"
    }), _gaq.push(["_trackEvent", "lifetime", "activated"])) : chrome.runtime.sendMessage({
        status: "nothing"
    })
}

function d() {
    var a = $.ajax({
        url: r + "?key=" + t
    });
    a.done(c)
}

function e() {
    console.log("attempt: %s | attempts left: %s | next timeout: %s", u, v - u, 1e3 + 100 * u);
    var a = $.ajax({
        url: r + "?key=" + t
    });
    a.done(function(a) {
        "valid" == a ? (console.log("telegram used id: " + a), localStorage.telegram_user_id = a, chrome.runtime.sendMessage({
            status: "ok"
        }), o(), p(), _gaq.push(["_trackEvent", "lifetime", "activated"])) : v >= u ? setTimeout(function() {
            u++, e()
        }, 300 * u * u) : (console.log("не удалось проверить ключ за " + v + " попыток"), u = 1)
    })
}

function f(b) {
    var c = localStorage.telegram_user_id,
        d = localStorage.random_key,
        e = new FormData;
    e.append("type", "message"), e.append("chat_id", c), e.append("key", d), e.append("text", b);
    var f = new XMLHttpRequest;
    f.onreadystatechange = function() {
        4 == f.readyState && 200 == f.status && (console.log("http.responseText: %s", f.responseText), a())
    }, f.open("POST", r, !0), console.log(e), f.send(e)
}

function g(b, c) {
    var d = localStorage.telegram_user_id,
        e = localStorage.random_key,
        f = b.type.split("/").pop(),
        g = new FormData;
    g.append("type", "image"), g.append("chat_id", d), g.append("key", e), g.append("caption", c), g.append("photo", b, "image." + f);
    var h = new XMLHttpRequest;
    h.onreadystatechange = function() {
        4 == h.readyState && 200 == h.status && (console.log("http.responseText: %s", h.responseText), a())
    }, h.open("POST", r, !0), console.log(g), h.send(g)
}

function h(a) {
    console.log("DownloadImageAsData");
    var b = new XMLHttpRequest;
    b.open("GET", a), b.responseType = "blob", b.onreadystatechange = function() {
        if (4 === b.readyState && 200 === b.status) {
            var c = b.response,
                d = a.split("/").pop();
            g(c, d)
        }
    }, b.send()
}

function i(a) {
    h(a)
}

function j(a) {
    if (_gaq.push(["_trackEvent", "menu", a.menuItemId]), "contextSelection" == a.menuItemId) {
        var b = chrome.i18n.getMessage("contexSelectionTitle") + "\r\n" + a.selectionText;
        b += "\r\n\r\n" + chrome.i18n.getMessage("contexSelectionFrom") + "\r\n" + a.pageUrl, f(b), console.log(b)
    }
    if ("contextImage" == a.menuItemId && (console.dir(a), i(a.srcUrl)), "contextPage" == a.menuItemId) {
        var b = a.pageUrl;
        f(b)
    }
    if ("contextLink" == a.menuItemId) {
        var b = a.linkUrl;
        f(b)
    }
}

function k(a) {
    var b;
    for (b = Math.floor(Math.random() * a.length); b == localStorage.randomInt;) b = Math.floor(Math.random() * a.length);
    return localStorage.randomInt = b, a[b]
}

function l() {
    console.log("icon clicked"), chrome.browserAction.setIcon({
        path: "sendme_disabled.png"
    }), setTimeout(function() {
        chrome.browserAction.setIcon({
            path: "sendme.png"
        })
    }, 100);
    var a = chrome.i18n.getMessage("contextLinkCaptions");
    a = a.split("|");
    var b = k(a);
    chrome.tabs.getSelected(null, function(a) {
        var c = b + "\r\n" + a.title + "\r\n" + a.url;
        f(c)
    })
}

function m() {
    switch (s) {
        case "ru":
            var a = "http://ideafromtomorrow.ru/sendme/welcome-page/index.html";
            break;
        default:
            var a = "http://ideafromtomorrow.ru/sendme/welcome-page/index-en.html"
    }
    a && chrome.tabs.create({
        url: a
    })
}

function n() {
    chrome.browserAction.setPopup({
        popup: "popup.html"
    }), chrome.browserAction.setIcon({
        path: "sendme_disabled.png"
    }), chrome.browserAction.setBadgeText({
        text: "ID !"
    })
}

function o() {
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

function p() {
    var a = chrome.i18n.getMessage("BotGreeting");
    m(), setTimeout(function() {
        f(a)
    }, 3e3)
}

function q() {
    chrome.contextMenus.create({
        id: "contextImage",
        title: chrome.i18n.getMessage("contextImage"),
        contexts: ["image"]
    }), chrome.contextMenus.create({
        id: "contextSelection",
        title: chrome.i18n.getMessage("contextSelection"),
        contexts: ["selection"]
    }), chrome.contextMenus.create({
        id: "contextLink",
        title: chrome.i18n.getMessage("contextLink"),
        contexts: ["link"]
    }), chrome.contextMenus.create({
        id: "contextPage",
        title: chrome.i18n.getMessage("contextPage"),
        contexts: ["page"]
    }), chrome.contextMenus.onClicked.addListener(j)
}
window.console || (window.console = {
    log: function() {},
    dir: function() {}
}), console.log("background.js engaged!");
var r = "https://smartsearchapp.com/alex/sendme/messageproxy.php",
    s = chrome.i18n.getUILanguage(),
    t = null,
    u = 1,
    v = 15,
    w = "UA-29391511-3",
    _gaq = _gaq || [];
_gaq.push(["_setAccount", w]), _gaq.push(["_trackPageview"]), localStorage.random_key ? t = localStorage.random_key : (t = b(), localStorage.random_key = t), chrome.runtime.onInstalled.addListener(function(a) {
    "install" == a.reason ? _gaq.push(["_trackEvent", "lifetime", "install"]) : "update" == a.reason
});
var x = "https://chrome.google.com/webstore/detail/sendme/ckkfnchnfmgpiejgaacmbngkcjbaaipd/support?" + s + "=en&gl=" + s;
chrome.runtime.setUninstallURL(x), chrome.extension.onMessage.addListener(function(a, b, c) {
    if ("getUserID" == a.msg && d(), "getUserIDcountdown" == a.msg && e(), "getNaviLink" == a.msg) {
        console.dir(a);
        var g = "yandexnavi://build_route_on_map?lat_to=" + a.lat + "&lon_to=" + a.lon,
            h = chrome.i18n.getMessage("naviLinkTitle");
        f(h + a.pointname + "\r\n" + g)
    }
    "initApp" == a.msg && o(), "welcomeInstall" == a.msg && p()
}), localStorage.telegram_user_id ? (console.log("user id is: " + localStorage.telegram_user_id), o()) : n();
var ga = document.createElement("script");
ga.type = "text/javascript", ga.async = !0, ga.src = "https://ssl.google-analytics.com/ga.js";
var y = document.getElementsByTagName("script")[0];
y.parentNode.insertBefore(ga, y);