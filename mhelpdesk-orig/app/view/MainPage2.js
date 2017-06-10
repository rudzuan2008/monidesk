Ext.define('mhelpdesk.view.MainPage2', {
	extend : 'Ext.Panel',
	xtype : 'mainPage2',
	requires : ['Ext.TitleBar', 'Ext.Video'],
	txtLogout : 'Exit',
	txtMenu : 'Menu',
	txtBack : 'Back',
	txtMotto : 'doc Mobile',
	txtCopyRight : '© 2016',
	txtCompany : 'Domain Oracle Sdn Bhd',
	txtSupportPhone : '+60129498134',
	txtSupportEmail : 'rudzuan@gmail.com',
	txtTitle : '<b>Resident Page</b>: Use below button to execute related operations. ' +
			'Certain operations are restricted to Resident only. ' ,
	txtFooter : 'Click on the items above to execute the related operation...',		
	txtWelcome : 'Welcome',
	config : {
		itemId : 'mainPage2',
		layout : 'fit',
		cls : 'p-mainpage',
		isLogin : false
	},
	initialize : function() {
		var locMod = this.getItemId() + '.initialize';
		var me = this;
		app.debugHandler('Start', '...', locMod);
		var strFooter = me.txtFooter;
		if (system.getIsLogin()) {
			if (system.getFullname()) strFooter = me.txtWelcome+' '+system.getFullname()+", "+me.txtFooter;
		}
		var imgSrc = system.getUrlPicturePath()+'images/hh.png';
		var headerPanel = Ext.create('Ext.Panel', {
			itemId: 'headerPanel',
			layout : {
				type : 'vbox',
				pack : 'center',
				align: 'center'
			},
			cls : 'r-main-title',
			items: [{
	            xtype: 'label',
	            html: "<img src='"+imgSrc+"' height='100px' />"
	            //height: 500,
	            //src: 'resources/images/LogoNissen.png'
	        },{
	        	xtype: 'label',
	        	style: 'font-weight:600;color: #ecce69;text-align: center;',
	        	html: 'for<br>HARTAMAS HEIGHT'
	        },{
	        	xtype: 'label',
	        	html: me.txtTitle 
	        }]
		});
		
//		var headerPanel = Ext.create('Ext.Panel', {
//			layout : {
//				type : 'vbox',
//				pack : 'center',
//				align: 'center'
//			},
//			cls : 'r-main-title',
//			html : me.txtTitle 
//		});
		var footerPanel = Ext.create('Ext.Panel', {
			layout : {
				type : 'vbox',
				pack : 'center',
				align: 'center'
			},
			cls : 'r-main-subtitle',
			html : strFooter
		});
		var mainPanel = Ext.create('Ext.Panel', {
			itemId: 'mainPanel',
			cls: 'r-main-panel',
			layout : {
				type: 'vbox',
				pack: 'center',
				align: 'stretch'
			}
		});
		this.setItems([{
			xtype : 'panel',
			cls: 'r-container',
			layout : {
				type : 'vbox',
				pack : 'center',
				align : 'stretch'
			},
			items : [headerPanel,mainPanel,footerPanel]
		}]);
		this.callParent(arguments);
	}
});