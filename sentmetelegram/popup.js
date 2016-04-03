//	Extension author: Alexander Us
//	info@alexandr.us
function a() {
    function a(a, b, c) {
        document.querySelector(a)[b] = chrome.i18n.getMessage(c)
    }
    a("#manual", "innerText", "popup_manual"), a("#manual_first", "innerText", "popup_manual_text_first"), a("#addbot", "innerText", "button_addbot"), a("#manual_second", "innerText", "popup_manual_text_second"), a("#getID", "innerText", "button_getID")
}

function b() {
    chrome.tabs.create({
        url: "https://telegram.me/" + f + "?start=" + e
    }), $("#getID").prop("disabled", !1), localStorage.ready = 1, chrome.extension.sendMessage({
        msg: "getUserIDcountdown"
    })
}

function c() {
    $(this).find("span").addClass("fa-spin"), $(this).html('<span class="fa fa-refresh fa-spin"></span>  ' + chrome.i18n.getMessage("button_getID_state_check")), chrome.extension.sendMessage({
        msg: "getUserID"
    }, function(a) {
        "ok" == a.status && (console.log("Принято из bg.js:"), console.dir(a))
    })
}

function d() {
    chrome.tabs.create({
        url: "https://www.youtube.com/watch?v=K3wVfM2zYe8"
    })
}
var e = localStorage.random_key,
    f = "SendMe_Bot",
    g = "UA-29391511-3",
    _gaq = _gaq || [];
_gaq.push(["_setAccount", g]), _gaq.push(["_trackEvent", "popup", "open"]), chrome.extension.onMessage.addListener(function(a, b, c) {
    "ok" == a.status && (console.log("пришел ответ из background.js: ", a.status), setTimeout(function() {
        $("#getID").html(chrome.i18n.getMessage("button_getID_state_done"))
    }, 200), setTimeout(function() {
        $(".manual").slideUp("slow")
    }, 1e3), chrome.extension.sendMessage({
        msg: "initApp"
    }), chrome.extension.sendMessage({
        msg: "welcomeInstall"
    })), "nothing" == a.status && (console.log("пришел ответ из background.js: ", a.status), $("#getID").html('<span class="fa fa-exclamation-circle"></span>  ' + chrome.i18n.getMessage("button_getID_state_again")))
}), $(document).ready(function() {
    var ga = document.createElement("script");
    ga.type = "text/javascript", ga.async = !0, ga.src = "https://ssl.google-analytics.com/ga.js";
    var e = document.getElementsByTagName("script")[0];
    e.parentNode.insertBefore(ga, e), localStorage.telegram_user_id ? (console.log("telegram_user_id was found"), console.log("убираем HELP из DOM"), $(".manual").remove()) : a(), localStorage.ready ? $("#getID").prop("disabled", !1) : $("#getID").prop("disabled", !0), $("#addbot").click(b), $("#getID").click(c), $("#youtube").click(d)
});