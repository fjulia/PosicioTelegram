function configure(){var e=$("#bot_token").val(),o=$("#bot_group").val(),a=$("#route_origin").val();""!=e&&""!=o&&($(this).find("span").addClass("fa-spin"),$(this).html('<span class="fa fa-refresh fa-spin"></span>  comprovant'),chrome.extension.sendMessage({msg:"createGroup",bot_id:e,groupName:o,origin:a}))}chrome.runtime.onMessage.addListener(function(e,o,a){"configured_ok"==e.status&&window.close()}),$(document).ready(function(){localStorage.telegram_bot_token&&localStorage.telegram_group_id?$(".manual").remove():localStorage.ready?$("#getID").prop("disabled",!1):$("#getID").click(configure)});