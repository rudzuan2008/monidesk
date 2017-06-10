Ext.define('mhelpdesk.view.MainPage', {
	extend : 'Ext.tab.Panel',
	xtype : 'mainpage',
	requires : ['Ext.TitleBar', 'Ext.Video'],
	txtSetting : "Setting",
	txtHome : "Home",
    txtTicket : "Ticket",
    txtStatus : "Status",
    txtSearch : "Search",
    txtNotification : "Notification",
    txtEvent: "Events",
    txtFaq : "FAQ",
	config : {
		itemId : 'mainpage',
		showAnimation : 'fade',
		hideAnimation : 'fadeOut',
		bodyStyle : "padding-left: 50px; background-image: url('images/bg/sc-now100.png');",
		styleHtmlContent : 'text-align: left',
		tabBar : {
			docked : 'bottom',
			style : 'background-color : transparent;',
			layout : {
				pack : 'center',
				align : 'center'//,
			},
			scrollable : {
				direction : 'horizontal',
				indicators : false
			}
		},
		ui : 'dark',
		items : []
	},
	initialize : function() {
		var me = this;
		var locMod = this.getItemId()+".initialize";
		mainController.dh(locMod,"debug","Start","...");
		try {
			var system = mhelpdesk.view.System;	
			var requireLogin = true;
			if (system.getIsLogin()==1) {
				requireLogin = false;
			}
			this.setItems([{
				title : me.txtHome,
				itemId : 'tabHome',
				iconCls : 'fa-home',
				style: 'font-family: "FontAwesome" !important;',
				iconMask : false,
				layout : 'fit',
				items : []
			},{
				title : me.txtTicket,
				itemId : 'tabTicket',
				iconCls : 'fa-envelope-o',
				style: 'font-family: "FontAwesome" !important;',
				layout : 'fit',
				items : [],
				hidden : requireLogin
			},{
				title : me.txtStatus,
				itemId : 'tabStatus',
				iconCls : 'fa-question',
				style: 'font-family: "FontAwesome" !important;',
				layout : 'fit',
				items : [],
				hidden : requireLogin
			},{
				title : me.txtNotification,
				itemId : 'tabNotification',
				iconCls : 'fa-search',
				style: 'font-family: "FontAwesome" !important;',
				layout : 'fit',
				items : [],
				hidden : requireLogin
			},{
				title : me.txtEvent,
				itemId : 'tabEvent',
				iconCls : 'fa-users',
				style: 'font-family: "FontAwesome" !important;',
				layout : 'fit',
				items : []
			},{
				title : me.txtSetting,
				itemId : 'tabSetting',
				iconCls : 'fa-gear',
				style: 'font-family: "FontAwesome" !important;',
				layout : 'fit',
				items : []
			}]);
			
			this.setActiveItem(0);
			this.callParent(arguments);
		} catch (ex) {
			console.error(ex);
		}
	},
	initTabItem: function(configStore) {
		var me = this;
		//var system = mhelpdesk.view.System;	
		var locMod = "mainPage.initTabItem";
		//console.error("isLogin:"+system.getIsLogin()+":"+system.getRemember()+":"+system.getLastId());
		mainController.dh(locMod,"debug","Start","...");
		try {
			var record = configStore.getAt(0);
			console.error(record);
			var tabUtama = me.down('#tabHome');
			tabUtama.add({
						xtype : 'homepage',
						cls : 'p-homepage',
						height: '100%',
						width: '100%'
						//xtype : 'timetable'
					});
			var tabStatus = me.down('#tabStatus');
			tabStatus.add({
				xtype : 'ticketList'
			});
			var tabNotification = me.down('#tabNotification');
			tabNotification.add({
				xtype : 'notificationpage'
			});
			
			var tabEvent = me.down('#tabEvent');
			tabEvent.add({
				xtype : 'eventpage'
			});
			var tabTicket = me.down('#tabTicket');
			var ticket = Ext.create('mhelpdesk.view.Ticket');
			tabTicket.add(ticket);
			
			if (record.get('allow_priority_change')!=0){
				ticket.down('#pri').setHidden(false);
			}
			if (record.get('enable_topic')==0){
				ticket.down('#topicId').setHidden(true);
			}
//			if (record.get('allow_online_attachments')!=0){
//				ticket.down('#fileBtnTicket').setHidden(false);
//				ticket.down('#filenameTicket').setHidden(false);
//				ticket.down('#labelFilenameTicket').setHidden(false);
//			}else{
				ticket.down('#fileBtnTicket').setHidden(true);
				ticket.down('#filenameTicket').setHidden(true);
				ticket.down('#labelFilenameTicket').setHidden(true);
//			}
			if (record.get('enable_captcha')==0){
				ticket.down('#labelCaptcha').setHidden(true);
				ticket.down('#panelCaptcha').setHidden(true);
			}
			
			var tabSetup = me.down('#tabSetting');
			tabSetup.add({
				xtype : 'systemConfig'
			});
			
		} catch (ex) {
			console.error(ex);
		}
	}
});