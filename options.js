function loadOptions() {
	$("#config_bot_token").val(localStorage.telegram_bot_token);
	$("#config_bot_group").val(localStorage.telegram_group_name);
	$("#config_save").click(saveOptions);
	$("#config_reset").click(eraseOptions);
}

function saveOptions() {
	var botId = $("#config_bot_token").val();
	var groupName = $("#config_bot_group").val();
	if (botId != '' && groupName != '') {
        //TODO Add bot into group and send hello message
        $(this).find("span").addClass("fa-spin");
        $(this).html('<span class="fa fa-refresh fa-spin"></span>  ' + "comprovant");


		chrome.extension.sendMessage({
            msg: "createGroup",
            bot_id: botId,
            groupName: groupName
        }, function (a) {
            "ok" == a.status && (console.log("Create bot result is:"), console.dir(a))
			location.reload();
        })
    }
}

function eraseOptions() {
	localStorage.clear();
	chrome.extension.sendMessage({
		msg: "reset",
	});
	$("#config_bot_token").val("");
	$("#config_bot_group").val("");
}

$(document).ready(function () {
	loadOptions();
});