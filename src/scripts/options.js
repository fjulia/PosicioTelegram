function loadOptions() {
	$("#config_bot_token").val(localStorage.telegram_bot_token);
	$("#config_bot_group").val(localStorage.telegram_group_name);
	$("#config_origin").val(localStorage.telegram_origin);
	$("#config_save").click(saveOptions);
	$("#config_reset").click(eraseOptions);
}

function saveOptions() {
	var botId = $("#config_bot_token").val().trim();
	var groupName = $("#config_bot_group").val().trim();
	var origin  = $("#config_origin").val().trim();
	if ((botId != '' && botId != localStorage.telegram_bot_token) || (groupName != '' && groupName != localStorage.telegram_group_name)) {
        //TODO Add bot into group and send hello message
        $(this).find("span").addClass("fa-spin");
        $(this).html('<span class="fa fa-refresh fa-spin"></span>  ' + "comprovant");
		chrome.extension.sendMessage({
            msg: "createGroup",
            bot_id: botId,
            groupName: groupName,
			request: origin
        });
    }else{
		if(origin && origin !='')localStorage.telegram_origin =  origin;
		window.close();
	}
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if ("configured_ok" == message.status) {
        window.close();
    }else if ("configured_failed" == message.status) {
        window.close();
        alert("La configuració ha fallat. Assegure't d'haver entrat les dades de configuració correctament!");
    }
});

function eraseOptions() {
	localStorage.clear();
	chrome.extension.sendMessage({
		msg: "reset",
	});
	$("#config_bot_token").val("");
	$("#config_bot_group").val("");
	$("#config_origin").val("");
}

$(document).ready(function () {
	loadOptions();
});