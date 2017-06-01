//system = mhelpdesk.view.System;
Ext.define('mhelpdesk.view.Main', {
    extend: 'Ext.navigation.View',
    xtype: 'main',
    txtMenu : "Menu",
    txtCompany : "",
    txtCopyRight : "Copyright © EDC-support.com",
    requires: [
        'Ext.TitleBar',
        'Ext.Video'
    ],
    config: {
        //tabBarPosition: 'bottom',
 		showAnimation : 'flip',
		itemId : 'main',
		title : '', // system.getTitle(),
		username : null,
		navigationBar : {
			itemId : 'navbar',
			height : 50,
			hidden: true,
			style : 'padding-top: 10px !important; padding-left: 5px; background-color: #006bb6 !important; background-image: -webkit-linear-gradient(top, #0398ff, #007ad0 3%, #005c9d) !important;'// 'background:
		},
		listeners : [{
			fn : 'onTap',
			event : 'tap',
			element : 'element'
		}]
    },
    initData : function() {
    	var me = this;
    	try{
    		var locale = mhelpdesk.view.Locale;
			var system = mhelpdesk.view.System;
			
			me.setTitle(system.getTitle());
			var lblDebug = me.down('#lblDebug');
			lblDebug.setHtml(system.getMembers()+" "+me.txtCopyRight+"&nbsp;&nbsp;&nbsp;&nbsp;"+'<a href="mailto:'
					+system.getEmail()+'"><i class="fa fa-envelope-o fa-1x"></i> '+system.getEmail()+'</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="tel:'
					+system.getPhone()+'"><i class="fa fa-phone fa-1x"></i></a>');
    	}catch(ex){
    		console.error(ex);
    	}
    },
    initialize : function() {
		var me = this;
		var locMod = "Main-initialize";
		
		try {
			var locale = mhelpdesk.view.Locale;
			var system = mhelpdesk.view.System;	
			//system.setTitle(locale.getText("mainTitle"));
			//me.setTitle(system.getTitle());
			this.setItems([
				{
					xtype : 'container',
	                title: this.getTitle(),
	                iconCls: 'home',
					itemId : 'pnlHome',
	                styleHtmlContent: true,
	                scrollable: false,
	                height : '100%',
					layout : 'fit',
	               	items : [{
								xtype : 'mainpage'
							}]
	            }, {
					xtype : 'panel',
					itemId : 'lblDebug',
					docked : 'bottom',
					height : 25,
					style : 'font-size: 8pt; margin-top: 10px; vertical-align: bottom; text-align: center;',
					html : me.txtCopyRight+"&nbsp;&nbsp;&nbsp;&nbsp;"+'<a href="mailto:'
					+system.getEmail()+'"><i class="fa fa-envelope-o fa-1x"></i> '+system.getEmail()+'</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="tel:'
					+system.getPhone()+'"><i class="fa fa-phone fa-1x"></i></a>'
	            }
            ]);
            
            var navBar = me.getNavigationBar();
            //console.info(navBar);
            var backButton = Ext.create('Ext.Button', {
            	itemId: 'btnBack',
            	width : 45,
                iconCls: 'fa-undo',
                iconAlign : 'top',
                //text : 'back',
				style: 'font-family: "FontAwesome" !important;',
                align : 'right',
				hidden : true,
				ui : 'plain', // round
				iconMask : true
            });
            navBar.setBackButton(backButton);
            
            navBar.add({
				style : 'font-family: "FontAwesome"; text-align: center;',
				xtype : "button",
				text : '...',
				itemId : 'lblUser',
				iconAlign : 'top',
				ui : "plain",
				align : 'right',
				docked : 'right'
			});
			navBar.add({
				iconCls : "fa-bars",
				//cls : 'mainMenu',
				//cls : 'menu-bar',
				// cls: 'my-toolbar',margin-top: 15px;
				style : 'font-family: "FontAwesome"; text-align: center; padding-left: 10px !important',
				xtype : "button",
				text : me.txtMenu,
				name : "btnMenuMain",
				itemId : 'btnMenuMain',
				iconAlign : 'top',
//				// iconCls : "list",
				ui : "plain",
				hidden: false,
				align : 'left'// ,
//					// margin : 10,
//					// docked : 'left'
			});
//            console.err(navBar);
//            navBar.add({
//				iconCls : "fa-bars",
//				//cls : 'mainMenu',
//				//cls : 'menu-bar',
//				// cls: 'my-toolbar',margin-top: 15px;
//				style : 'font-family: "FontAwesome"; text-align: center; padding-left: 10px !important',
//				xtype : "button",
//				text : me.txtMenu,
//				name : "btnMenuMain",
//				itemId : 'btnMenuMain',
//				iconAlign : 'top',
//				// iconCls : "list",
//				ui : "plain",
//				hidden: false,
//				align : 'left'// ,
//					// margin : 10,
//					// docked : 'left'
//			});
			this.callParent(arguments);
		}catch(ex){
			console.error(ex);
		}
    },
	onTap : function(e) {
		var me = this;
		//console.warn(e.target.className);
		if (e.target.className=="x-button-icon x-shown fa-bars") {
			//console.error("menuClick");
			me.fireEvent('menuClick');	
		}
		
	},
	onConnectionTap : function() {
		var me = this;
		console.log("tap connection");
		wbiztech.app.fireEvent('checkConnection');
	},
	initScreenMode : function(screenMode) {
		var me = this;
		var navBar = me.getNavigationBar();
		var lblHtml = me.down('#lblDebug');
		var system = mhelpdesk.view.System;	
		if (screenMode==0) {
			navBar.setHidden(false);
		}else{
			navBar.setHidden(true);
		}
		var title = system.getTitle();
		if (title) {
			me.setTitle(title);
			navBar.setTitle(title);
		}
		lblHtml.setHtml(me.getDefaultLabel());
	},
	setTopText : function(cls, msgText, appendFlag, autoCloseFlag, timeout) {
		var me = this;
		var lblMsg = me.down('#lblUser');
		if (appendFlag) {
			var str = lblMsg.getText();
			lblMsg.setText(str+msgText);
		}else{
			lblMsg.setText(msgText);
		}
		lblMsg.setCls(cls);
		var delayTask = Ext.create('Ext.util.DelayedTask', function() {
			lblMsg.setText(system.getBuild());
			lblMsg.setCls('normal');
		}, this);
		if (autoCloseFlag) {
			var timeDelay = 5000;
			if (timeout) {
				timeDelay = timeout;
			}
			delayTask.delay(timeDelay);
		}
	},
	setBottomText : function(msgText, appendFlag, autoCloseFlag, timeout) {
		var me = this;
		var lblHtml = me.down('#lblDebug');
		var system = mhelpdesk.view.System;	
		if (msgText) {
			if (appendFlag) {
				lblHtml.setHtml(me.getDefaultLabel() + " " + msgText);
			}else{
				lblHtml.setHtml(msgText);
			}
		} else {
			lblHtml.setHtml(me.getDefaultLabel());
		}
		var delayTask = Ext.create('Ext.util.DelayedTask', function() {
			lblHtml.setHtml(me.getDefaultLabel());
		}, this);
		if (autoCloseFlag) {
			var timeDelay = 5000;
			if (timeout) {
				timeDelay = timeout;
			}
			delayTask.delay(timeDelay);
		}

	},
	getDefaultLabel: function(){
		var me = this;
		var system = mhelpdesk.view.System;	
		//console.log("screen Mode");
		var company = system.getCompany();
		if (!company) {
			company = "";	
		}
		var strHtml = company+"&nbsp;&nbsp;"+'<a href="mailto:'
				+system.getEmail()+'"><i class="fa fa-envelope-o fa-1x"></i> </a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="tel:'
				+system.getPhone()+'"><i class="fa fa-phone fa-1x"></i></a> ';
		return strHtml;
		
		
	}
});
