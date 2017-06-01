Ext.define('mhelpdesk.view.Search', {
	extend : 'Ext.form.Panel', // 'Ext.navigation.View',
	xtype : 'search',
	requires : ['Ext.TitleBar', 'mhelpdesk.view.FaqList'],
	config : {
		itemId : 'status',
		title : '',
		scrollable : true,
		pinHeaders : true,
		layout : 'fit',
		styleHtmlContent: true,
		listeners : []
		//cls : 'landingpage'//,
		//layout : 'vbox'
		//style : 'background-color: transparent;'
	},
	txtDesc : "Please input search information is below and click button Submit.",
	txtSubmit : "Search",
	txtCompany : "Company Name",
	txtCompanyDesc : "Enter company name",
	txtProduct : "Product",
	txtProductDesc : "Enter product",
	txtSearchField : "Enter search criteria",
	initialize : function() {
		var me = this;
		try {
			var row1 = Ext.create("Ext.Container", {
				layout: {
					type: 'hbox',
					align: 'middle',
					pack: 'left'
				},
				height : 35,
				width: '100%',
				items : [{
			            xtype: 'selectfield',
			            flex: 1,
			            //ui: 'plain',
			            inputCls:'selecttext',
			            //label: me.txtStartSearch,
			            //labelAlign: 'top',
			            itemId: 'searchKey',
			            name: 'searchKey',
			            options: [
			                {text: me.txtCompany,  value: 'client_organization'},
			                {text: me.txtProduct, value: 'client_product'}
			            ]
					},{
						xtype : 'button',
						itemId : 'btnSubmit',
						name : 'btnSubmit',
						ui : 'confirm',
						iconAlign : 'left',
						iconCls : 'fa-search',
						//style : 'font-family: "FontAwesome";margin: .5em .5em .5em;padding-left: 5px; width: 80px; text-align: -webkit-center;',
						style : 'font-family: "FontAwesome";margin: .5em .5em .5em;padding-left: 5px;width: 100px;',
						text : me.txtSubmit,
						listeners : {
							tap : function(thisButton, e, eOpts) {
								
								me.fireEvent('submit', me, thisButton, e, eOpts);
	
							}
						}
					}]
			});
			var row2 = Ext.create("Ext.Container", {
				layout: {
					type: 'hbox',
					align: 'top',
					pack: 'left'
				},
				//height : 30,
				items : [{
		            xtype: 'searchfield',
		            //label : me.txtSearch,
		            //labelWidth : 45,
		            autoComplete: true,
		            flex:1,
		            width : '100%',
		            itemId: 'searchValue',
		            name: 'searchValue',
		            placeHolder: me.txtSearchField
				}]
			});
			var pnlList = Ext.create("Ext.Panel", {
				itemId : 'userAccess',
				hidden : false,
				layout : {
					type : 'vbox',
					align : 'stretch',
					pack : 'top'
				},
				items : [{
					//html: "this is a test"
					xtype : 'clientList',
					width : '100%',
					height : '100%'
				}]
			});
			me.setItems([pnlList, {
				xtype : 'toolbar',
				docked : 'top',
				ui : 'white',
				layout: {
					type: 'vbox',
					align : 'stretch',
					pack: 'left'
				},
				items : [row1, row2]
			}]);
		} catch (ex) {
			console.error(ex);
		}
	}
});