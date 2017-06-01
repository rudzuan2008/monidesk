Ext.define('mhelpdesk.view.MainPage', {
	extend : 'Ext.tab.Panel',
	xtype : 'mainpage',
	requires : ['Ext.TitleBar', 'Ext.Video'],
	txtSetting : "Setting",
	txtHome : "Home",
    txtTicket : "Ticket",
    txtStatus : "Status",
    txtSearch : "Search",
    txtFaq : "FAQ",
	config : {
		itemId : 'mainpage',
		showAnimation : 'fade',
		hideAnimation : 'fadeOut',
		bodyStyle : "padding-left: 50px; background-image: url('images/bg/sc-now100.png');",
		styleHtmlContent : 'text-align: left',
		
		//layout : 'fit',
		//scrollable: true,
		tabBar : {
			// Dock it to the bottom
			docked : 'bottom',
			style : 'background-color : transparent;',
			// style : "background-image:
			// url('images/bg/sc-now100.png');",
			// Change the layout so each of the tabs are
			// centered
			// vertically and horizontally
			// style: 'opacity: 0.6;',
			layout : {
				pack : 'center',
				align : 'center'//,
				// type : 'card',
//				animation : {
//					type : 'fadeOut'
//				}
			},

			// Make the tabbar scrollable horizontally, and
			// disabled the
			// indicators
			// scrollable : true
			scrollable : {
				direction : 'horizontal',
				indicators : false
			}
		},

		// here we specify the ui of the tabbar to light
		ui : 'dark',

		// defaults allow us to add default configuratons for
		// each of
		// the items added into
		// this container. adding scrollable true means that all
		// items
		// in this tabpanel will
		// be scrollable unless otherwise specified in the item
		// configuration
		// defaults : {
		// scrollable : {
		// direction : 'vertical'
		// }
		// },
		items : []
	},
	initialize : function() {
		var me = this;
		try {
			
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
				items : []
			},{
				title : me.txtStatus,
				itemId : 'tabStatus',
				iconCls : 'fa-question',
				style: 'font-family: "FontAwesome" !important;',
				layout : 'fit',
				items : []
			},{
				title : me.txtSearch,
				itemId : 'tabSearch',
				iconCls : 'fa-search',
				style: 'font-family: "FontAwesome" !important;',
				layout : 'fit',
				items : []
			},{
				title : me.txtFaq,
				itemId : 'tabFaq',
				iconCls : 'fa-tags',
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
		var system = mhelpdesk.view.System;	
		try {
			var record = configStore.getAt(0);
			var tabUtama = me.down('#tabHome');
			tabUtama.add({
						xtype : 'homepage',
						height: '100%',
						width: '100%'
						//xtype : 'timetable'
					});
			var tabStatus = me.down('#tabStatus');
			tabStatus.add({
				xtype : 'status'
			});
			var tabSearch = me.down('#tabSearch');
			tabSearch.add({
				xtype : 'search'
			});
			var tabFaq = me.down('#tabFaq');
			tabFaq.add({
				xtype : 'faq'
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
			if (record.get('allow_online_attachments')!=0){
				ticket.down('#fileBtnTicket').setHidden(false);
				ticket.down('#filenameTicket').setHidden(false);
			}
			if (record.get('enable_captcha')==0){
				ticket.down('#labelCaptcha').setHidden(true);
				ticket.down('#panelCaptcha').setHidden(true);
			}
			
			var tabSetup = me.down('#tabSetting');
			tabSetup.add({
				xtype : 'systemConfig'
				//xtype : 'homepage'
			});
			
		} catch (ex) {
			console.error(ex);
		}
	}
});