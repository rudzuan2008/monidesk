Ext.define("mhelpdesk.component.MenuHome", {
	extend : "Ext.Menu",
	alias : 'widget.menuhome',
	txtMain : "Utama",
	txtReturn : "Kembali",
	txtSetup : "Konfigurasi Aplikasi",
	txtTimetable : "Selenggara Jadual",
	txtUpload : "Tukar Gambar Paparan",
	txtIntercom : "Intercom",
	txtBilling : "Check Bills",
	txtExternal : "External Call",
	txtMenuHeader : 'HOME MENU',
	txtLogout : 'Logout',
	config : {
		defaults : {
			xtype : "menubutton",
			styleHtmlContent : 'text-align: left'
		},
		cls : 'r-menu-home',
		width : '50%',
		minWidth : 250,
		scrollable : true,
		layout : {
			type: 'vbox',
			pack: 'top',
			align: 'stretch'
		},
		listeners : [{
			fn : 'onSwipe',
			event : 'swipe',
			element : 'element'
		}]
	},
	onSwipe : function(e) {
		var me = this;
		console.info(e.direction);
		if (e.direction == "left") {
			me.fireEvent('showMe', me);
		}

	},
	initialize : function() {
		var me = this;
		//console.error("Menu HOME Set XXX");
		var system = mhelpdesk.view.System;	
		var isLogin = false;
		if (system.getIsLogin()==1) {
			isLogin=true;
		}

		this.setItems([{
//			xtype: 'label',
//			docked: 'top',
//			cls: 'r-menu-header',
//			html: me.txtMenuHeader
//		},{
			text : "Guard Setup",
			iconCls : 'fa-users',
			itemId : 'mnuGuardSetup',
			name : 'mnuGuardSetup',
			ui : 'action',
			hidden : (system.getGroup()=='Administrator')? false:true,
			menu : "mnuGuardSetup"
		}, {
			text : this.txtSetup,
			iconCls : 'fa-cogs',
			itemId : 'mnuSetting',
			name : 'mnuSetting',
			hidden : true,
			ui : 'action',
			menu : "mnuSetting"
		},{
			text : "Login",
			iconCls : 'fa-sign-in',
			itemId : 'mnuLogin',
			name : 'mnuLogin',
			hidden : isLogin,
			ui : 'action',
			menu : "mnuLogin"
		}, {
			itemId : 'menuHomeHome',
			iconCls : 'fa-home',
			menu : "BACK",
			ui : 'action',
			hidden : true,
			text : this.txtMain
		}, {
			text : this.txtIntercom,
			iconCls : 'fa-tty',
			itemId : 'mnuIntercom',
			name : 'mnuIntercom',
			hidden : true,
			ui : 'action',
			menu : "mnuIntercom"
		}, {
			text : this.txtExternal,
			iconCls : 'fa-phone',
			itemId : 'mnuExternalCall',
			name : 'mnuExternalCall',
			hidden : true,
			ui : 'action',
			menu : "mnuExternalCall"
		},{
			text : this.txtBilling,
			iconCls : 'fa-credit-card',
			itemId : 'mnuBilling',
			name : 'mnuBilling',
			hidden : true,
			ui : 'action',
			menu : "mnuBilling"
		}, {
			itemId : 'menuHome99',
			name : 'menuHome99',
			iconCls : 'fa-undo',
			menu : "BACK",
			ui : 'confirm',
			text : this.txtReturn
		}, {
			text : "SOS",
			iconCls : 'fa-fire',
			itemId : 'mnuSOS',
			name : 'mnuSOS',
			hidden : !isLogin,
			ui : 'decline',
			menu : "mnuSOS"
		}, {
			text : me.txtLogout,
			iconCls : 'fa-sign-out',
			itemId : 'mnuLogout',
			name : 'mnuLogout',
			hidden : !isLogin,
			ui : 'decline',
			menu : "mnuLogout"
		} ]);
		this.callParent(arguments);
	}
});