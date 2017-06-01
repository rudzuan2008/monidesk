Ext.define('mhelpdesk.view.visitor.RegisterVisitorResident', {
	extend: 'Ext.form.Panel', 
	xtype: 'registerVisitorResident',
	requires: [
		'Ext.TitleBar'
	],
	config: {
		itemId: 'registerVisitorResident',
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
	txtVisitorInfo: 'Enter visitor information here',
	txtPictureInfo: 'Push the TAKE PICTURE button to snap visitor identity',
	txtName: 'Visitor',
	txtPhone: 'Contact No',
	txtVehicle: 'Vehicle No',
	txtMainTitle: 'VISITOR REGISTRATION',
	txtUnit: 'Unit No',
	txtClient: 'Resident Name',
	txtPassNo: 'Pass No',
	_localProductStore: null,
	initStore: function() {
		var locMod = this.getItemId()+".initStore";
		var me = this;
		
		me._localProductStore = Ext.getStore('localProductStore');
		
	},
	initialize: function() {
		var me = this;
		var system = mhelpdesk.view.System;
		var locale = mhelpdesk.view.Locale;
		me.initStore();
		var dt = new Date();
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
				iconCls : 'fa-database',
				text : me.txtSave,
				listeners : {
					tap : function(thisButton, e, eOpts) {
						me.fireEvent('save', me, thisButton, e, eOpts);

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
	            title: 'Visitor Details',
	            //width: '50%',
	            instructions: me.txtVisitorInfo,
	            items: [{	
	            	xtype: 'selectfield',
					cls: 'r-tool-field',
					usePicker: true,
					label: me.txtUnit,
					displayField: 'serial_no',
					valueField: 'serial_no',
	            	itemId: 'asset_unit',
	            	name: 'asset_unit',
	            	store: me._localProductStore
	            },{
					xtype: 'selectfield',
					cls: 'r-tool-field',
					itemId: 'category',
					name: 'category',
					usePicker: true,
					label: 'Category',
					hidden: false,
	                options: [
	                    {text: 'Visitor',  value: 'visitor'},
	                    {text: 'Delivery Vehicle', value: 'delivery'}
	                ]
				},{
                    xtype: 'datepickerfield',
                    //label: 'Visit Date',
                    iconCls: 'fa-calendar',
                    label: '<i class="fa fa-calendar" aria-hidden="true"></i> Visit Date',
                    itemId: 'dateVisit',
                    name: 'dateVisit',
                    value: new Date()
                },{
                  	xtype:'timepickerfield',
                  	iconCls: 'fa-calendar',
                  	label:'<i class="fa fa-clock-o" aria-hidden="true"></i> Visit Time',
                  	picker:{
                     	AMText: 'AM',
                      	PMText: 'PM'
                   	},
                 	itemId:'timeVisit',
                 	name: 'timeVisit',
                 	value: dt.setHours(8, 0, 0, 0)
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
			}]
			
		})	
		this.setItems([{
				xtype: 'label',
				cls: 'r-title',
				html: me.txtMainTitle
			},toolbarOper, mainContent
		]);
		this.callParent(arguments);
	}
});