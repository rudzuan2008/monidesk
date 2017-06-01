Ext.define('mhelpdesk.view.OccupantPage', {
	extend : 'Ext.Panel',
	xtype : 'occupantPage',
	requires : [ 'Ext.TitleBar', 'mhelpdesk.view.client.OccupantList' ],
	config : {
		title : 'FAQ',
		itemId : 'occupantPage',
		cls: 'p-occupant-page',
		layout : {
			type : 'vbox',
			pack : 'center',
			align : 'stretch'
			
		}
	},
	txtDesc : 'List of Occupant Contact',
	txtCall : 'Call External',
	txtClose : 'Return',
	txtSearch : 'Search',
	txtInstruction : 'Touch on the selected resident list to make a call...',
	_localAllClientStore: null,
	initStore : function() {
		var me = this;
		var locMod = this.getItemId()+'.initStore';
		
		me._localAllClientStore = Ext.getStore('localAllClientStore');
		me._localAllClientStore.load();
		
	},
	initialize : function() {
		var me = this;
		var locMod = this.getItemId()+'.initialize';
		var system = mhelpdesk.view.System;
		try {
			me.initStore();
			var pnlTool = Ext.create('Ext.Container',{
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
		                	{text: 'Choose', value: 'choose'},
		                    {text: 'Unit No',  value: 'unit'},
		                    {text: 'Name',  value: 'name'}
		                    
		                ],
		                listeners: {
		                	change: function( thisList, newValue, oldValue, eOpts ) {
		                		
		                		if (newValue=="choose") {
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
						flex: 2,
						store : me._localAllClientStore,
						displayField : 'unitowner',
						valueField : 'client_id',
		                listeners: {
		                	change: function( thisList, newValue, oldValue, eOpts ) {
		                		
		                		try{
			                		var occupantList = me.down('#occupantList');
			                		var client_id = newValue;
			                		var record = utils.findRecord(me._localAllClientStore,'client_id',client_id);
			                		if (record) {
			                			occupantList.select(record);
			                			occupantList.scrollToRecord( record, true, true );
			                		}
			                		
			                		//me.fireEvent('select',me,occupantList,thisList,newValue);
		                		}catch(ex){
		                			app.eh(ex,locMod);
		                		}
		                	}
		                }
					},{
						xtype: 'searchfield',
						cls: 'r-input-field',
						flex: 1,
						hidden: true,
						itemId: 'filterText',
						name: 'filterText',
						listeners : {
							clearicontap : function(thisSearch, e, eOpts ) {
								var selection = me.down('#selection').getValue();
								me.fireEvent('onClearSearch',me,selection, thisSearch, e, eOpts);
							},
    						keyup: function(thisSearch, e, eOpts ) {
    							var selection = me.down('#selection').getValue();
								me.fireEvent('onSearchKeyUp',me,selection, thisSearch, e, eOpts);
    						}
						}
						
					},{
						xtype : 'button',
						itemId : 'btnReturnMain',
						name : 'btnReturnMain',
						ui : 'plain',
						cls: 'r-square-button',
						//disabled : true,
						iconAlign : 'top',
						iconCls : 'fa-times',
						text : me.txtClose
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
		        xtype: 'label',
		        itemId: 'errorMessage',
		        cls : 'error'
	        },{
				html : me.txtDesc,
				cls : 'r-title',
				padding : 5
			},{
				html : me.txtInstruction,
				cls : 'r-subtitle',
				padding : 5,
				style : 'background-color: white; font-weight: bold;'
			}, {
				xtype : 'occupantList',
				itemId: 'occupantList',
				name: 'occupantList',
				cls: 'r-list',
				width : '100%',
				height : '100%'
			} ]);
		} catch (ex) {
			console.error(ex);
		}
	}
});