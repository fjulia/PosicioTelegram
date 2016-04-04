
function createGroup() {

    var botId = $("#bot_token").val();
    var groupName = $("#bot_group").val();
    if (botId!='' && groupName!=''){
        //TODO Add bot into group and send hello message
        $(this).find("span").addClass("fa-spin");
        $(this).html('<span class="fa fa-refresh fa-spin"></span>  ' + "comprovant");
        
        
         chrome.extension.sendMessage({
            msg: "createGroup",
            bot_id: botId,
            groupName: groupName
        }, function (a) {
            "ok" == a.status && (console.log("Create bot result is:"), console.dir(a))
        })
    }
}



$(document).ready(function () {
    localStorage.telegram_bot_token && localStorage.telegram_group_id ? (console.log("telegram_bot_token was found"), $(".manual").remove()) : localStorage.ready ? $("#getID").prop("disabled", !1) : $("#getID").click(createGroup)
});
