Ext.define("wtadmin.component.MenuHome", {
	extend : "Ext.Menu",
	alias : 'widget.menuhome',
	txtAboutUs: "About Us",
	txtHome: "Home",
	txtExit: "Exit",
	config : {
		defaults : {
			xtype : "menubutton",
			styleHtmlContent : 'text-align: left'
		},
		cls: 'menu-bar',
		width : '50%',
		minWidth : 250,
		scrollable : 'vertical'
	},
	initialize : function() {
		this.setItems([ {
			itemId : 'menuHomeHome',
			iconCls : 'fa-home',
			menu : "BACK",
			ui : 'action',
			text : this.txtHome
		},{
			text : this.txtAboutUs,
			iconCls : 'fa-user',
			itemId : 'mnuAbout',
			name : 'mnuAbout',
			ui : 'action',
			hidden : false,
			menu : "mnuAbout"
		},{
			itemId : 'menuLogout',
			name : 'menuLogout',
			iconCls : 'fa-sign-out',
			menu : "menuLogout",
			ui : 'decline',
			text : this.txtExit
		}]);
		this.callParent(arguments);
	}
});