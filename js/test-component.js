$(function() {
	var ctx = NavTab.getCurrentTab().$tabContent;

	/*==================== MsgBox组件测试 - begin ====================*/
	$("#btn-info", ctx).on("click", function() {
		MsgBox.info("提示消息");
	});

	$("#btn-warn", ctx).on("click", function() {
		MsgBox.warn("警告消息");
	});

	$("#btn-error", ctx).on("click", function() {
		MsgBox.error("错误消息，系统异常");
	});

	$("#btn-confirm", ctx).on("click", function() {
		MsgBox.confirm("请确认信息", function() {
			MsgBox.info("您点击了确定按钮");
		}, function() {
			MsgBox.info("您点击了取消按钮");
		});
	});

	$("#btn-open-remote", ctx).on("click", function() {
		MsgBox.open({
			title: "测试打开模态消息框",
			url: contextPath + "/pages/test-level3.html"
		});
	});

	$("#btn-open-remote-iframe", ctx).on("click", function() {
		MsgBox.open({
			title: "测试打开iframe消息框",
			url: contextPath + "/login.html",
			iframe: true,
			width: 850,
			iframeHeight: 450
		});
	});

	$("#btn-open-static", ctx).on("click", function() {
		MsgBox.open({
			title: "测试打开模态消息框",
			content: "<p>测试内容</p><button class='btn btn-default'>测试按钮</button>",
			buttons: [{
				clazz: "close-btn",
				label: "关闭"
			}]
		});
	});

	$("#btn-open-json", ctx).on("click", function() {
		MsgBox.open({
			title: "测试打开JSON",
			url: contextPath + "/json/error.json"
		});
	});

	$("#btn-open-tab", ctx).on("click", function() {
		NavTab.openTab({
			id: "test-navtab",
			title: "测试tab页",
			url: contextPath + "/pages/test-code.html"
		});
	});

	$("#btn-open-tab-iframe", ctx).on("click", function() {
		NavTab.openTab({
			id: "test-navtab-iframe",
			title: "测试内嵌iframe的tab页",
			url: contextPath + "/login.html",
			iframe: true
		});
	});
	/*==================== MsgBox组件测试 - end ====================*/


	/*==================== 日期控件测试 - begin ====================*/
	$("#dateInput", ctx).datepicker({
		language: "zh-CN",
		autoclose: true,
		format: "yyyy-mm-dd",
		endDate: new Date()
	});

	$("#dateTimeInput", ctx).datetimepicker({
		language: "zh-CN",
		weekStart: 1,
		autoclose: 1,
		format: "yyyy-mm-dd hh:ii",
		minuteStep: 2,
		endDate: new Date()
	});
	/*==================== 日期控件测试 - end ====================*/


	/*==================== datatables组件测试 - begin ====================*/
	$("#test-table", ctx).dataTables({
		columnFields: ["url", "desc", "ip", "dateCreated", "remark"],
		indexColumn: true,
		selectionType: "checkbox",
		serverSide: true
	});

	$("#queryBtn", ctx).on("click", function() {
		$("#test-table", ctx).dataTables().reload({
			url: contextPath + "/json/tableData_resp.json",
			data: {
				name: $("#queryName").val()
			}
		});
	});
	/*==================== datatables组件测试 - end ====================*/

	// 测试菜单插件
	$("#testMenu1", ctx).contextMenu({
		trigger: "click",
		menus: [{
			text: "测试左键菜单1",
			handler: function() {
				MsgBox.info("点击了左键菜单1");
			}
		}, {
			text: "测试左键菜单2"
		}, {
			text: "测试左键菜单3"
		}]
	});

	$("#testMenu2", ctx).contextMenu({
		theme: "custom-menu",
		trigger: "mouseright",
		menus: [{
			text: "测试右键菜单1",
			handler: function() {
				MsgBox.info("点击了右键菜单1");
			}
		}, {
			text: "测试右键菜单2",
			handler: function() {
				MsgBox.info("点击了右键菜单2");
			}
		}]
	});
});