
function configure() {

    //var botId = '186718542:AAE38mXwxSRPw95m89Vbx1b4NMvOkuU4GuQ';
    //var groupName = "Ferran";
    //var origin = "41.494440, 2.359283"    
    var botId = $("#bot_token").val().trim();
    var groupName = $("#bot_group").val().trim();
    var origin = $("#route_origin").val().trim();
    if (botId != '' && groupName != '') {
        //TODO Add bot into group and send hello message
        $(this).find("span").addClass("fa-spin");
        $(this).html('<span class="fa fa-refresh fa-spin"></span>  ' + "comprovant");


        chrome.extension.sendMessage({
            msg: "createGroup",
            bot_id: botId,
            groupName: groupName,
            origin: origin
        });



    }
}


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if ("configured_ok" == message.status) {
        window.close();
    } else if ("configured_failed" == message.status) {
        window.close();
        alert("La configuració ha fallat. Assegure't d'haver entrat les dades de configuració correctament!");
    }
});



$(document).ready(function () {
    (localStorage.telegram_bot_token && localStorage.telegram_group_id) ? (console.log("telegram_bot_token was found"), $(".manual").remove()) : localStorage.ready ? $("#getID").prop("disabled", !1) : $("#getID").click(configure)

    $("#bot_token").val(localStorage.tmp_telegram_bot_token);
    $("#bot_group").val(localStorage.tmp_telegram_group_name);
    $("#route_origin").val(localStorage.tmp_telegram_origin);
    $("#bot_token").on('change keyup pasate', function () {
        localStorage.tmp_telegram_bot_token = $("#bot_token").val();
    });
    $("#bot_group").on('change keyup pasate',function () {
        localStorage.tmp_telegram_group_name = $("#bot_group").val();
    });
    $("#route_origin").on('change keyup pasate',function () {
        localStorage.tmp_telegram_origin = $("#route_origin").val();
    });
});
