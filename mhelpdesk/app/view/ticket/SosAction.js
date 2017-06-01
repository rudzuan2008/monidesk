Ext.define('mhelpdesk.view.ticket.SosAction', {
	extend: 'Ext.form.Panel', 
	xtype: 'sosAction',
	requires: [
		'Ext.TitleBar'
	],
	config: {
		itemId: 'sosAction',
		cls: 'p-sos-action',
		ticketId:null,
		layout: {
			type: 'vbox',
			pack: 'top',
			align: 'stretch'
			
		}
	},
	txtFilter: 'Find',
	txtAction : 'Immediate Action',
	txtCallResident: "RESIDENT",
	txtCallMgmt: "MGMT",
	txtVisitUnit: "VISIT UNIT",
	txtClose: "CLOSE",
	txtSOSUnit: 'SOS FROM UNIT NO ',
	txtSOSDetail: 'SOS Details: ',
	txtSOSInfo: 'SOS information details',
	_ticketId: null,
	_localTicketStore: null,
	_record: null,
	initStore: function() {
		var locMod = this.getItemId()+".initStore";
		var me = this;
		me._localTicketStore = Ext.getStore('localTicketStore');
		me._record = utils.findRecord(me._localTicketStore,'ticket_id',me.getTicketId());
		
	},
	initialize: function() {
		var locMod = this.getItemId()+'.initialize';
		var me = this;
		var system = mhelpdesk.view.System;
		var locale = mhelpdesk.view.Locale;
		try{
		me._ticketId=me.getTicketId();
		me.initStore();
		var toolbarAction = Ext.create("Ext.Toolbar", {
			itemId: 'toolbarOper',
			docked: 'bottom',
			layout : {
				type : 'hbox',
				pack : 'start',
				align : 'stretch'
			},
			width : '100%',
			items : [{
				xtype : 'button',
				itemId : 'btnUpdate',
				name : 'btnUpdate',
				style: 'font-size: 1.5em;',
				text: '<span style="font-weight:bold;font-size: 1em;"><span class="fa-stack fa-lg">'
  				+ '		<i class="fa fa-square-o fa-stack-2x"></i>'
  				+ '		<i class="fa fa-fire fa-stack-1x r-red-color"></i></span>'
  				+ '</span>'
  				+ me.txtAction,
				flex: 1
			}]
		});
		var toolbarOper = Ext.create("Ext.Toolbar", {
			itemId: 'toolbarOper',
			docked: 'top',
			layout : {
				type : 'hbox',
				pack : 'end',
				align : 'stretch'
			},
			width : '100%',
			items : [{
				xtype : 'button',
				itemId : 'btnCallOwner',
				name : 'btnCallOwner',
				ui: 'plain',
				cls: 'r-square-button',
				iconAlign : 'top',
				iconCls : 'fa-phone',
				text : me.txtCallResident,
				listeners : {
					tap : function(thisButton, e, eOpts) {
						me.fireEvent('callresident', me, me._record.data.client_id, thisButton, e, eOpts);

					}
				}
			},{
				xtype : 'button',
				itemId : 'btnCallMgmt',
				name : 'btnCalMgmt',
				ui: 'plain',
				cls: 'r-square-button',
				iconAlign : 'top',
				iconCls : 'fa-users',
				text : me.txtCallMgmt,
				listeners : {
					tap : function(thisButton, e, eOpts) {
						me.fireEvent('callmanagement', me, thisButton, e, eOpts);

					}
				}
			},{
				xtype : 'button',
				itemId : 'btnVisit',
				name : 'btnVisit',
				ui: 'plain',
				cls: 'r-square-button',
				iconAlign : 'top',
				iconCls : 'fa-upload',
				text : me.txtVisitUnit,
				listeners : {
					tap : function(thisButton, e, eOpts) {
						me.fireEvent('visit', me, me._record.data.ticket_id, thisButton, e, eOpts);

					}
				}
			},{
				xtype : 'button',
				itemId : 'btnRetunMain',
				ui: 'plain',
				cls: 'r-square-button',
				name : 'btnRetunMain',
				iconAlign : 'top',
				iconCls : 'fa-times',
				text : me.txtClose,
				listeners : {
					tap : function(thisButton, e, eOpts) {
						me.fireEvent('close', me, thisButton, e, eOpts);

					}
				}
			}]
		});
		
		var strTitle = me.txtSOSUnit+me._record.data.asset_unit+' '+me._record.data.name;
  				
		var strDetail = me.txtSOSDetail+me._record.data.fcreated+' ('+me._record.data.status+')';
				
		var mainContent = Ext.create('Ext.Panel',{
			itemId: 'mainContent',
			cls: 'r-main',
			layout: {
				type : 'vbox',
				pack : 'start',
				align: 'stretch'

			},
			items: [{
				xtype: 'label',
				cls: 'r-title',
				html: strTitle
			},{
				xtype: 'fieldset',
	            title: strDetail,
	            instructions: me.txtSOSInfo,
	            items: [{	
	            	xtype: 'textareafield',
	            	//label: 'SOS Message',
	            	readOnly: true,
	            	maxRows: 4,
	            	itemId: 'subject',
	            	name: 'subject'
	            }]
			}]
			
		});
		this.setItems([toolbarOper, mainContent,toolbarAction]);
		this.callParent(arguments);
		}catch(ex){
			app.eh(ex,locMod);
		}
	}
});