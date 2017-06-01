Ext.define('mhelpdesk.view.StatusPage', {
	extend: 'Ext.Panel', 
	xtype: 'statusPage',
	requires: [
		'Ext.TitleBar'
	],
	config: {
		itemId: 'statusPage',
		cls: 'p-status-page',
		layout: {
			type: 'vbox',
			pack: 'center',
			align: 'stretch'
			
		}
	},
	txtFilter: 'Find',
	txtStatus: 'Status',
	_isReady: false,
	initialize: function() {
		var me = this;
		var system = mhelpdesk.view.System;
		var locale = mhelpdesk.view.Locale;
		var pnlTool = Ext.create('Ext.Container',{
			itemId: 'pnlTool',
			layout: {
				type: 'hbox',
				pack: 'start',
				align: 'center'
			},
			items: [
				{
					xtype: 'selectfield',
					itemId: 'selection',
					usePicker: true,
					cls: 'r-tool-item',
	                //label: 'Choose one',
					//width: '50%',
					flex: 1,
	                options: [
	                    {text: 'Status',  value: 'status'},
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
					usePicker: true,
					//flex: 1,
	                //label: 'Choose one',
					hidden: false,
	                options: [
	                    {text: 'OPEN',  value: 'open'},
	                    {text: 'CLOSED', value: 'closed'},
	                    {text: 'SOS',  value: 'sos'}
	                ],
	                listeners: {
	                	change: function( thisList, newValue, oldValue, eOpts ) {
	                		me.fireEvent('filter',me,'status',thisList,newValue);
	                	}
	                }
				},{
					xtype: 'datepickerfield',
					cls: 'r-tool-field',
					flex: 1,
					hidden: true,
					itemId: 'filterText',
					name: 'filterText',
					value: new Date(),
					dateFormat: 'Y-m-d',
					listeners: {
						change: function( thisDate, newDate, oldDate, eOpts ) {
							if (me._isReady) me.fireEvent('filter',me,'date',thisDate,newDate);
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
			//width : '100%',
			items : [pnlTool]
		});
		this.setItems([toolbarOper,{

			xtype	: 'ticketList',
			cls		: 'r-list',
			//style	: 'background-color: rgba(0, 0, 0, 0.23); border: 1px solid rgba(0, 0, 0, 0.23);cursor: pointer;',
			title	: 'Ticket List',
			width	: '100%',
			height	: '100%'
		}]);
		me.on('show',function(){
			me._isReady=true;
		});
		this.callParent(arguments);
	}
});
