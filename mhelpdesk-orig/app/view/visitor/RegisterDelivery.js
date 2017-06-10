Ext.define('mhelpdesk.view.visitor.RegisterDelivery', {
	extend: 'Ext.form.Panel', 
	xtype: 'registerDelivery',
	requires: [
		'Ext.TitleBar'
	],
	config: {
		itemId: 'registerDelivery',
		cls: 'p-visitor-register',
		layout: {
			type: 'vbox',
			pack: 'top',
			align: 'stretch'
			
		}
	},
	txtFilter: 'Find',
	txtCamera : 'TAKE PICTURE',
	txtCallResident: "RESIDENT",
	txtCallMgmt: "MGMT",
	txtClose: "CLOSE",
	txtSave : "SAVE",
	txtVisitorInfo: 'Enter delivery information here',
	txtPictureInfo: 'Push the TAKE PICTURE button to snap visitor identity',
	txtName: 'Delivery',
	txtPhone: 'Contact No',
	txtVehicle: 'Vehicle No',
	txtMainTitle: 'DELIVERY REGISTRATION',
	txtUnit: 'Unit No',
	txtClient: 'Resident Name',
	txtPassNo: 'Pass No',
	initialize: function() {
		var me = this;
		var system = mhelpdesk.view.System;
		var locale = mhelpdesk.view.Locale;
		var toolbarCamera = Ext.create("Ext.Toolbar", {
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
				itemId : 'btcCamera',
				name : 'btcCamera',
				style: 'font-size: 1.5em;',
				text: '<span style="font-weight:bold;font-size: 1em;"><span class="fa-stack fa-lg">'
  				+ '		<i class="fa fa-square-o fa-stack-2x"></i>'
  				+ '		<i class="fa fa-camera fa-stack-1x"></i></span>'
  				+ '</span>'
  				+ me.txtCamera,
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
				itemId : 'btnSave',
				ui: 'plain',
				cls: 'r-square-button',
				name : 'btnSave',
				iconAlign : 'top',
				iconCls : 'fa-times',
				text : me.txtSave,
				listeners : {
					tap : function(thisButton, e, eOpts) {
						me.fireEvent('save', me, thisButton, e, eOpts);

					}
				}
			},{
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
	            title: 'Delivery Details',
	            //width: '50%',
	            instructions: me.txtVisitorInfo,
	            items: [{
	            	xtype: 'container',
	            	layout: {
	            		type: 'hbox',
	            		pack: 'start',
	            		align: 'stretch'
	            	},
	            	defaults : {
	            		anchor: '100%'
	            	},
	            	items: [{	
		            	xtype: 'textfield',
		            	//labelAlign : 'top',
		            	//width: '95%',
		            	label: me.txtUnit,
		            	itemId: 'asset_unit',
		            	name: 'asset_unit'
		            },{
		            	xtype: 'button',
		            	cls: 'r-popup-button',
		            	iconCls: 'fa-search',
		            	itemId: 'btnCheck',
		            	name: 'btnCheck'
		            }]
	            },{	
	            	xtype: 'textfield',
	            	//labelAlign : 'top',
	            	label: me.txtName,
	            	itemId: 'name',
	            	name: 'name'
	            },{	
	            	xtype: 'textfield',
	            	//labelAlign : 'top',
	            	label: me.txtPhone,
	            	itemId: 'phone',
	            	name: 'phone'
	            },{	
	            	xtype: 'textfield',
	            	//labelAlign : 'top',
	            	label: me.txtVehicle,
	            	itemId: 'vehicle',
	            	name: 'vehicle'
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
	            	itemId: 'pass',
	            	name: 'pass'
	            },{
					xtype : 'textfield',
					//label : me.txtPicDesc,
					labelAlign : 'top', 
					labelWrap : true,
					minWidth : 100,
					flex: 2,
					//placeHolder : me.txtPicDesc,
					itemId : 'img_path',
					name : 'img_path',
					required : false,
					readOnly : true,
					hidden: true
				}, {
					itemId : 'loadedImage',
					xtype : 'img',
					width : '80%',
					height : '200px',
					style : 'margin-top:5px; margin-bottom:5px; background-position: left;'
				}]
			}]
			
		})	
		this.setItems([{
				xtype: 'label',
				cls: 'r-title',
				html: me.txtMainTitle
			},toolbarOper, mainContent, toolbarCamera]);
		this.callParent(arguments);
	}
});