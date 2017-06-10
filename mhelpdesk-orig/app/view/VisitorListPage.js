Ext.define('mhelpdesk.view.VisitorListPage', {
	extend: 'Ext.Panel', 
	xtype: 'visitorListPage',
	requires: [
		'Ext.TitleBar'
	],
	config: {
		itemId: 'visitorListPage',
		cls: 'p-visitorlist-page',
		layout: {
			type: 'vbox',
			pack: 'top',
			align: 'stretch'
			
		}
	},
	txtFilter: 'Find',
	txtDesc : 'List of Visitor',
	txtInstruction : 'Touch on the selected Visitor list to open...',
	initialize: function() {
		var locMod = this.getItemId()+".initialize";
		var me = this;
		var system = mhelpdesk.view.System;
		var locale = mhelpdesk.view.Locale;
		try{
			var pnlTool = Ext.create('Ext.Panel',{
				itemId: 'pnlTool',
				layout: {
					type: 'hbox',
					pack: 'start',
					align: 'stretch'
				},
				width: '100%',
				items: [
					{
						xtype: 'selectfield',
						itemId: 'selection',
						//usePicker: true,
						cls: 'r-tool-item',
						flex: 1,
		                options: [
		                    {text: 'Status',  value: 'status'},
		                    {text: 'Resident', value: 'name'},
		                    {text: 'Unit No',  value: 'asset_unit'},
		                    {text: 'Date',  value: 'created'}
		                ],
		                listeners: {
		                	change: function( thisList, newValue, oldValue, eOpts ) {
		                		
		                		if (newValue=="status") {
		                			me.down('#filterStatus').setHidden(false);
		                			me.down('#filterText').setHidden(true);
		                		}else{
		                			me.down('#filterStatus').setHidden(true);
		                			me.down('#filterText').setHidden(false);
		                		}
		                	}
	
		                }
					},{
						xtype: 'selectfield',
						cls: 'r-tool-field',
						itemId: 'filterStatus',
						//usePicker: true,
						flex: 2,
		                //label: 'Choose one',
						hidden: false,
		                options: [
		                    {text: 'OPEN',  value: 'open'},
		                    {text: 'CLOSED', value: 'closed'}
		                ]
					},{
						xtype: 'textfield',
						cls: 'r-tool-field',
						flex: 1,
						hidden: true,
						itemId: 'filterText'
					},{
						xtype : 'button',
						//width : 100,
						ui: 'plain',
						cls: 'r-square-button',
						itemId : 'btnFilter',
						name : 'btnFilter',
						iconAlign : 'top',
						iconCls : 'fa-search',
						text : me.txtFilter,
						listeners : {
							tap : function(thisButton, e, eOpts) {
								me.fireEvent('filter', me, thisButton, e, eOpts);
	
							}
						}
					},{
						xtype : 'button',
						//width : 100,
						ui: 'plain',
						cls: 'r-square-button',
						itemId : 'btnClose',
						name : 'btnClose',
						iconAlign : 'top',
						iconCls : 'fa-times',
						text : "Return",
						listeners : {
							tap : function(thisButton, e, eOpts) {
								me.fireEvent('close', me, thisButton, e, eOpts);
	
							}
						}
					}
				]
				
			});
			var toolbarOper = Ext.create("Ext.Toolbar", {
				itemId: 'toolbarOper',
				layout : {
					type : 'hbox',
					pack : 'start',
					align : 'stretch'
				},
				width : '100%',
				items : [pnlTool]
			});
			this.setItems([toolbarOper,{
					html : me.txtDesc,
					cls : 'r-title',
					padding : 5
				},{
					html : me.txtInstruction,
					cls : 'r-subtitle',
					padding : 5,
					style : 'background-color: white; font-weight: bold;'
				},{
	
				xtype	: 'visitorList',
				//style	: 'background-color: rgba(0, 0, 0, 0.23); border: 1px solid rgba(0, 0, 0, 0.23);cursor: pointer;',
				title	: 'Visitor List',
				width	: '100%',
				height	: '100%'
			}]);
			this.callParent(arguments);
		}catch(ex){
			app.eh(ex,locMod);
		}
	}
});
