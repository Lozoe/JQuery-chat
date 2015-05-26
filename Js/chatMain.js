$(function() {
    $("#Button1").click(function() { //按钮点击事件
        //1.发送内容，验证是否为空，不为空，发送，否则，提示
        var $content = $("#txtContent"); //发送内容
        if ($content.val() !== "") {
            sendContent($content.val());
        } else {
            alert("发送不能为空");
            $content.focus();
            return false;
        }
    });
    //2.显示表情图标，并且将表情图标的id号显示在文本框中
    // var $a="<img src='url'/>";
    // $("#c").html($a);
    InitFace();
    $("table tr td img").click(function() {
        //表情图标单击事件
        var strContent = $("#txtContent").val() + "<:" + this.id + ":>";
        $("#txtContent").val(strContent);
    });
    //2.定时获取最新聊天内容和当前在线的用户信息
    AutoUpdContent();
    var hander=setInterval("AutoUpdContent()",5000);//执行定时获取函数
    //通过span元素有效侦察每一次的ajax请求的发出然后结束的过程，目的是优化用户的体验，提高web应用的性能
    //元素绑定全局ajaxStart事件
    $("#divMsg").ajaxStart(function() {
    	$(this).show().html("正在发送数据...");//显示元素
    });
    //元素绑定全局ajaxStop事件
    $("#divMsg").ajaxStop(function() {
    	$(this).html("已完成").hide();//ajax完成，隐藏提示信息
    });
});

function SendContent(content) {
    $.ajax({
        type: "POST",
        url: "DealData.aspx",
        data: "action=SendContent&d=" + new Date() + "&content=" + content,
        success: function() {
            if (data == "1") {
                GetMessageList();
                $("#txtContent").val("");
            } else {
                alert("发送失败!");
                return false;
            }
        }
    });
}

function InitFace() {
    var strHTML = "";
    for (var i = 1; i <= 10; i++) {
        strHTML += "<img src='Face/" + i + ".gif ' id='" + i + "'/>";
    }
    $("#divFace").html(strHTML);
}

function GetMessageList() {
    $ajax({
        /*type: "POST",
        url: "DealData.aspx",
        data: "action=OnLineList&d=" + new Date(),
        success: function(data) {//data接受服务端返回的数据
            $("#divOnLine").html(data);
        }*/
        type: "POST",
        url: "DealData.aspx",
        data: "action=OnLineList&d=" + new Date(),
        success: function(data) { 
            $("#divContent").html(data);
        }
    });
}

function GetOnlineList() {
	$ajax({
		type:"POST",
		url:"DealData.aspx",
		data:"action=OnlineList&d="+new Date(),
		success:function(data) {
			$("#divOnline").html(data);
		}
	});
}

function AutoUpdContent() {
    GetMessageList(); //获取最新的聊天内容
    GetOnlineList(); //获取当前在线用户信息
}
