Ext.define('mhelpdesk.view.ViewTicket', {
	extend : 'Ext.form.Panel', // 'Ext.navigation.View',
	xtype : 'viewTicket',
	requires : ['Ext.TitleBar'],
	config : {
		itemId : 'viewTicket',
		cls: 'p-view-ticket',
		title : '',
		scrollable : true,
		pinHeaders : true,
		layout : 'fit',
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
			var toolbarOper = Ext.create("Ext.Container", {				
				layout: {
					type: 'hbox',
					pack: 'center',
					align: 'stretch'
				},
				items : [{
					xtype : 'hiddenfield',
					itemId : 'ticket_id',
					name : 'ticket_id'
				},{
					xtype : 'button',
					itemId : 'btnPost',
					name : 'btnPost',
					ui : 'plain',
					cls : 'r-square-button',
					iconAlign : 'top',
					iconCls : 'fa-envelope-o',
					style : 'font-family: "FontAwesome";margin: .5em .5em .5em;padding-left: 5px; width: 80px; text-align: -webkit-center;',
					text : me.txtPost,
					listeners : {
						tap : function(thisButton, e, eOpts) {
							
							me.fireEvent('postReply', me, thisButton, e, eOpts);
	
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
					pack : 'top',
					align : 'stretch'
				},
				items : [{
					xtype: 'button',
					cls: 'r-button',
					text : me.txtUp,
					iconCls : 'fa-arrow-up',
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
				},{
					xtype: 'label',
					itemId : 'btnShowHide',
					name : 'btnShowHide',
					border: 2,
					itemId : 'hdrSummary',
					style : 'border: 1px solid rgba(0, 0, 0, 0.23) !important;',
    				html: 'My label!'
				}]
			},{
				xtype : 'toolbar',
				docked : 'bottom',
				ui : 'white',
				layout : {
					type : 'vbox',
					pack : 'top',
					align : 'stretch'
				},
				items : [toolbarOper]
			},{
					//html: "this is a test"
					xtype : 'messageList',
					cls: 'r-list',
					width : '99%',
					height : '99%'
				}]);
			
		} catch (ex) {
			console.error(ex);
		}
	}
});