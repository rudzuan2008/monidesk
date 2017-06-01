Ext.define("mhelpdesk.component.MenuHome", {
	extend : "Ext.Menu",
	alias : 'widget.menuhome',
	txtMain : "Utama",
	txtReturn : "Kembali",
	txtSetup : "Konfigurasi Aplikasi",
	txtTimetable : "Selenggara Jadual",
	txtUpload : "Tukar Gambar Paparan",
	config : {
		defaults : {
			xtype : "menubutton",
			styleHtmlContent : 'text-align: left'
		},
		width : '50%',
		minWidth : 250,
		scrollable : true,
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
		//console.error("Menu HOME Set XXX");
		this.setItems([ {
			text : "Profail",
			iconCls : 'fa-users',
			itemId : 'mnuUser',
			name : 'mnuUser',
			ui : 'action',
			hidden : true,
			menu : "mnuUser"
		}, {
			text : this.txtSetup,
			iconCls : 'fa-cogs',
			itemId : 'mnuSetting',
			name : 'mnuSetting',
			hidden : false,
			ui : 'action',
			menu : "mnuSetting"
		}, {
			text : "About Us",
			iconCls : 'fa-sign-in',
			itemId : 'mnuAboutUs',
			name : 'mnuAboutUs',
			hidden : true,
			ui : 'action',
			menu : "mnuAboutUs"
		}, {
			itemId : 'menuHomeHome',
			iconCls : 'fa-home',
			menu : "BACK",
			ui : 'action',
			text : this.txtMain
		}, {
			itemId : 'menuHome99',
			name : 'menuHome99',
			iconCls : 'fa-undo',
			menu : "BACK",
			ui : 'confirm',
			text : this.txtReturn
		} ]);
		this.callParent(arguments);
	}
});