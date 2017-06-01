Ext.define('mhelpdesk.view.UserTicket', {
	extend : 'Ext.form.Panel', // 'Ext.navigation.View',
	xtype : 'userTicket',
	requires : ['Ext.TitleBar', 'mhelpdesk.view.TicketList'],
	config : {
		itemId : 'userTicket',
		title : '',
		scrollable : true,
		pinHeaders : true,
		layout : 'fit',
//		defaults : {
//			width : '100%',
//			//style : 'font-size:.75em;'
//		},
		listeners : [{
			fn : 'onSwipe',
			event : 'swipe',
			element : 'element'
		}]//,
		//layout : 'vbox'
		//style : 'background-color: transparent;'
	},
	txtView: 'View Ticket',
	onSwipe : function(e) {
		var me = this;
		console.info(e.direction);
		if (e.direction == "right") {
			me.fireEvent('swipeBack', me);
		}
	},
	initialize : function() {
		var me = this;
		var system = mhelpdesk.view.System;
		try {
			var toolbarOper = Ext.create("Ext.Container", {				
				layout: {
					type: 'hbox',
					align: 'top',
					pack: 'stretch'
				},
				width : '100%',
				items : [{
					xtype : 'button',
					itemId : 'btnView',
					name : 'btnView',
					ui : 'white',
					disabled : true,
					iconAlign : 'top',
					iconCls : 'fa-search',
					style : 'font-family: "FontAwesome";margin: .5em .5em .5em;padding-left: 5px; width: 80px; text-align: -webkit-center;',
					text : me.txtView,
					listeners : {
						tap : function(thisButton, e, eOpts) {
							
							me.fireEvent('viewTicket', me, thisButton, e, eOpts);
	
						}
					}
				}]
			});
//			var pnlList = Ext.create("Ext.Panel", {
//				itemId : 'userAccess',
//				hidden : false,
//				height : '100%',
//				width : '100%',
//				layout : {
//					type : 'vbox',
//					align : 'stretch',
//					pack : 'top'
//				},
//				items : [{
//					//html: "this is a test"
//					xtype : 'ticketList',
//					width : '100%',
//					height : '100%'
//				}]
//			});
			me.setItems([{
				xtype : 'toolbar',
				docked : 'top',
				ui : 'white',
				layout: {
					type: 'vbox',
					align : 'stretch',
					pack: 'left'
				},
				items : [toolbarOper]
				
			},{
				//html: "this is a test"
				xtype : 'ticketList',
				width : '100%',
				height : '100%'
			}]);
		}catch (ex) {
			console.error(ex);
		}
	}
});