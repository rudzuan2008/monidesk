Ext.define('mhelpdesk.view.visitor.ViewVisitorResident', {
	extend: 'Ext.form.Panel', 
	xtype: 'viewVisitorResident',
	requires: [
		'Ext.TitleBar'
	],
	config: {
		itemId: 'viewVisitorResident',
		cls: 'p-visitorresident-view',
		ticketId: null,
		layout: {
			type: 'vbox',
			pack: 'top',
			align: 'stretch'
			
		}
	},
	txtFilter: 'Find',
	txtCamera : 'TAKE PICTURE',
	txtCallResident: "CALL RESIDENT",
	txtCallMgmt: "INFORM MANAGEMENT",
	txtClose: "Return",
	txtSave : "Save",
	txtVisitorInfo: 'Your Visitor information details',
	txtPictureInfo: 'Your Visitor identity details',
	txtName: 'Visitor',
	txtPhone: 'Contact No',
	txtVehicle: 'Vehicle No',
	txtMainTitle: 'VIEW/UPDATE VISIT STATUS',
	txtUnit: 'Unit No',
	txtClient: 'Resident Name',
	txtPassNo: 'Pass No',
	txtAction: 'Close - Visitor Exit',
	_ticketId: null,
	initialize: function() {
		var locMod = this.getItemId()+'.initialize';
		var me = this;
		var system = mhelpdesk.view.System;
		var locale = mhelpdesk.view.Locale;
		try{
			me._ticketId=me.getTicketId();
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
	  				+ '		<i class="fa fa-download fa-stack-1x r-red-color"></i></span>'
	  				+ '</span>'
	  				+ me.txtAction,
					flex: 1,
					listeners : {
						tap : function(thisButton, e, eOpts) {
							me.fireEvent('save', me, me._ticketId, thisButton, e, eOpts);
	
						}
					}
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
			
			var mainContent = Ext.create('Ext.Panel',{
				itemId: 'mainContent',
				cls: 'r-main',
				layout: {
					type : 'vbox',
					pack : 'start',
					align: 'stretch'
	
				},
				items: [{
					xtype: 'fieldset',
		            title: 'Visitor Details',
		            //width: '50%',
		            instructions: me.txtVisitorInfo,
		            items: [{	
		            	xtype: 'textfield',
		            	//labelAlign : 'top',
		            	//width: '95%',
		            	label: me.txtUnit,
		            	itemId: 'asset_unit',
		            	name: 'asset_unit',
		            	readOnly: true
		            },{	
		            	xtype: 'textfield',
		            	//labelAlign : 'top',
		            	label: me.txtName,
		            	itemId: 'visitor_name',
		            	name: 'visitor_name',
		            	readOnly: true
		            },{	
		            	xtype: 'textfield',
		            	//labelAlign : 'top',
		            	label: me.txtPhone,
		            	itemId: 'visitor_phone',
		            	name: 'visitor_phone'
		            },{	
		            	xtype: 'textfield',
		            	//labelAlign : 'top',
		            	label: me.txtVehicle,
		            	itemId: 'visitor_vehicle',
		            	name: 'visitor_vehicle',
		            	readOnly: true
		            }]
				},{
					xtype: 'fieldset',
					//width: '45%',
		            title: 'ID Picture Taken',
		            instructions: me.txtPictureInfo,
		            layout: {
		            	type: 'hbox',
		            	pack: 'center',
		            	align: 'stretch'
		            },
		            items: [{	
		            	xtype: 'textfield',
		            	//labelAlign : 'top',
		            	label: me.txtPassNo,
		            	itemId: 'pass_no',
		            	name: 'pass_no',
		            	readOnly: true
		            }, {
						itemId : 'loadedImage',
						xtype : 'img',
						width : '80%',
						height : '210px',
						style : 'margin-top:5px; margin-bottom:5px; background-position: left;'
					}]
				}]
				
			})	
			this.setItems([{
					xtype: 'label',
					cls: 'r-title',
					html: me.txtMainTitle
				},toolbarOper, mainContent,toolbarAction]);
			this.callParent(arguments);
		}catch(ex){
			app.eh(ex,locMod);
		}
	}
});