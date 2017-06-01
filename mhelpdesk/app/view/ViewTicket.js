Ext.define('mhelpdesk.view.ViewTicket', {
	extend : 'Ext.form.Panel', // 'Ext.navigation.View',
	xtype : 'viewTicket',
	requires : ['Ext.TitleBar'],
	config : {
		itemId : 'viewTicket',
		title : '',
		scrollable : true,
		pinHeaders : true,
		layout : 'fit',
//		defaults : {
//			width : '100%'
//		},
		listeners : [{
					fn : 'onSwipe',
					event : 'swipe',
					element : 'element'
				}]
	},
	txtDesc : 'Ticket #',
	txtCreated : 'Created on',
	txtName : 'Name',
	txtEmail : 'Email',
	txtPhone : 'Phone',
	txtDept : 'Department',
	txtSubject : 'Subject',
	txtPost : 'Post Reply',
	txtUp : 'Hide',
	txtDown : 'Show',
	onSwipe : function(e) {
		var me = this;
		console.info(e.direction);
		if (e.direction == "right") {
			me.fireEvent('back', me);
		}
	},
	initialize : function() {
		var me = this;
		var system = mhelpdesk.view.System;
		try {
//			var pnlList = Ext.create("Ext.Panel", {
//				itemId : 'userAccess',
//				hidden : false,
//				layout : {
//					type : 'vbox',
//					align : 'stretch',
//					pack : 'top'
//				},
//				items : [{
//					//html: "this is a test"
//					xtype : 'messageList',
//					width : '100%',
//					height : '100%'
//				}]
//			});

			var toolbarOper = Ext.create("Ext.Container", {				
				layout: {
					type: 'hbox',
					align: 'top',
					pack: 'stretch'
				},
				width : '100%',
				items : [{
					xtype : 'hiddenfield',
					//label : "ticket_id",
					//labelWrap : true,
					itemId : 'ticket_id',
					name : 'ticket_id'
				},{
					xtype : 'button',
					itemId : 'btnPost',
					name : 'btnPost',
					ui : 'white',
					iconAlign : 'top',
					iconCls : 'fa-envelope-o',
					style : 'font-family: "FontAwesome";margin: .5em .5em .5em;padding-left: 5px; width: 80px; text-align: -webkit-center;',
					text : me.txtPost,
					listeners : {
						tap : function(thisButton, e, eOpts) {
							
							me.fireEvent('postReply', me, thisButton, e, eOpts);
	
						}
					}
				},{
					xtype : 'button',
					itemId : 'btnShowHide',
					name : 'btnShowHide',
					ui : 'white',
					iconAlign : 'top',
					iconCls : 'fa-arrow-up',
					style : 'font-family: "FontAwesome";margin: .5em .5em .5em;padding-left: 5px; width: 80px; text-align: -webkit-center;',
					text : me.txtUp,
					listeners : {
						tap : function(thisButton, e, eOpts) {
							var clsNow = thisButton.getIconCls();
							var hdrSummary = me.down('#hdrSummary');
							console.error(clsNow);
							//me.fireEvent('postReply', me, thisButton, e, eOpts);
							if (clsNow=="fa-arrow-up") {
								thisButton.setIconCls('fa-arrow-down');
								thisButton.setText(me.txtDown);
								hdrSummary.setHidden(true);
							}else{
								thisButton.setIconCls('fa-arrow-up');
								thisButton.setText(me.txtUp);
								hdrSummary.setHidden(false);
							}
	
						}
					}
				}]
			});
			me.setItems([{
				xtype : 'toolbar',
				docked : 'top',
				ui : 'white',
				layout : {
					type : 'vbox',
					align : 'stretch',
					pack : 'top'
				},
				items : [toolbarOper,{
					xtype: 'label',
					border: 2,
					itemId : 'hdrSummary',
					style : 'border: 1px solid rgba(0, 0, 0, 0.23) !important;',
    				html: 'My label!'
				}]
			},{
					//html: "this is a test"
					xtype : 'messageList',
					width : '100%',
					height : '100%'
				}]);
			
		} catch (ex) {
			console.error(ex);
		}
	}
});