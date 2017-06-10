Ext.define('mhelpdesk.view.Intercom', {
	extend : 'Ext.Panel',
	xtype : 'intercom',
	requires : [ 'Ext.TitleBar', 'mhelpdesk.view.CallList' ],
	config : {
		title : 'FAQ',
		itemId : 'intercom',
		cls : 'p-intercom',
		layout : {
			type : 'vbox',
			pack : 'center',
			align : 'stretch'
			
		}
	},
	txtDesc : 'List of Intercom Contact',
	txtCall : 'Call External',
	initialize : function() {
		var me = this;
		var system = mhelpdesk.view.System;
		try {
			var pnlTool = Ext.create("Ext.Container", {				
				layout: {
					type: 'hbox',
					align: 'top',
					pack: 'stretch'
				},
				width : '100%',
				items : [{
					xtype : 'button',
					itemId : 'btnCall',
					name : 'btnCall',
					ui : 'white',
					disabled : true,
					iconAlign : 'top',
					iconCls : 'fa-pone',
					style : 'font-family: "FontAwesome";margin: .5em .5em .5em;padding-left: 5px; width: 80px; text-align: -webkit-center;',
					text : me.txtCall,
					listeners : {
						tap : function(thisButton, e, eOpts) {
							
							me.fireEvent('callExternal', me, thisButton, e, eOpts);
	
						}
					}
				}]
			});
			var toolbarOper = Ext.create("Ext.Toolbar", {
				itemId: 'toolbarOper',
				layout : {
					type : 'hbox',
					pack : 'start',
					align : 'stretch'
				},
				//width : '100%',
				items : [pnlTool]
			});
			this.setItems([{
				xtype : 'toolbar',
				docked : 'bottom',
				ui : 'white',
				layout : {
					type : 'hbox',
					pack : 'center',
					align : 'center'
					
				},
				items : [toolbarOper]
			},{
		        xtype: 'label',
		        itemId: 'errorMessage',
		        cls : 'error'
	        },{
				html : 'aaa'+me.txtDesc,
				padding : 5,
				style : 'background-color: white; font-weight: bold;'
			}, {
				xtype : 'callList',
				width : '100%',
				height : '100%'
			} ]);
		} catch (ex) {
			console.error(ex);
		}
	}
});