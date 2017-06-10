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
		cls: 'p-main',
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
			lblDebug.setHtml(me.getDefaultLabel());
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
			
			console.error("SCREENMODE:"+system.getScreenMode());
			var mainPage;
			if (system.getScreenMode()==2) {
				mainPage = Ext.create('mhelpdesk.view.GuardPage');
				var page = mainPage;
				var mainPanel = page.down('#mainPanel');
				var aryButton = [];
				
				var blnIsLogin = system.getIsLogin();
				var strLogin= "LOGIN";
				var clsLogin="fa-sign-in fa-2x";
				if (blnIsLogin) {
					strLogin="LOGOUT";	
					clsLogin="fa-sign-out fa-2x";
				}
				
				var isEditable = true;
				var isCallEnable = true;
				var buttonCls="r-mainguard-button";
				//var aryButton = [];
				var localGuardIconStore = Ext.getStore('localGuardIconStore');
				localGuardIconStore.load({
					scope: this,
					callback: function(records,operation,success) {
						//console.error("OPERATION: "+records.length);
						for (var x = 0; x < records.length; x++) {
							try{
							var rec = records[x];
							//console.error(rec.data.action);
							var rec = records[x];
							var tapAction = rec.data.action;
							//console.error(tapAction);
							var tapButton=null;
							var strLabel = locale.getText(tapAction);
							switch (tapAction) {
							case "tapSos" :
								tapButton = Ext.create('Ext.Button', {
									xtype: 'button',
									itemId: tapAction,
									disabled: !isEditable,
									showAnimation: 'popOut',
									cls: buttonCls,
									iconAlign: 'top',
									iconCls: rec.data.icon+' fa-2x',
									text : strLabel,
									listeners: {
										tap : function(thisButton, e, eOpts) {
											//console.error('tap',thisButton.getItemId());
											page.fireEvent(thisButton.getItemId(), page, thisButton, e, eOpts);
										}
									}
								});
								me._tapSos=tapButton;
								aryButton.push(tapButton);
								if (rec.data.badge) {
									tapButton.setBadgeText(me._totalSos);
								}	
								break;
							case "tapVisitor" :
								tapButton = Ext.create('Ext.Button', {
									xtype: 'button',
									itemId: tapAction,
									disabled: !isEditable,
									showAnimation: 'popOut',
									cls: buttonCls,
									iconAlign: 'top',
									iconCls: rec.data.icon+' fa-2x',
									text : strLabel,
									listeners: {
										tap : function(thisButton, e, eOpts) {
											//console.error('tap',thisButton.getItemId());
											page.fireEvent(thisButton.getItemId(), page, thisButton, e, eOpts);
										}
									}
								});
								me._tapVisitor=tapButton;
								aryButton.push(tapButton);
								if (rec.data.badge) {
									tapButton.setBadgeText(me._totalVisitor);
								}	
								break;
							case "tapLogin" :
								tapButton = Ext.create('Ext.Button', {
									xtype: 'button',
									itemId: tapAction,
									iconCls: clsLogin,
									text : strLogin,
									disabled: !isEditable,
									showAnimation: 'popOut',
									cls: buttonCls,
									iconAlign: 'top',
									listeners: {
										tap : function(thisButton, e, eOpts) {
											//console.error('tap',thisButton.getItemId());
											page.fireEvent(thisButton.getItemId(), page, thisButton, e, eOpts);
										}
									}
								});
								me._tapLogin=tapButton;
								aryButton.push(tapButton);
								break;
							case "tapSetting" :
								tapButton = Ext.create('Ext.Button', {
									xtype: 'button',
									itemId: tapAction,
									showAnimation: 'popOut',
									cls: buttonCls,
									iconAlign: 'top',
									iconCls: rec.data.icon+' fa-2x',
									text : strLabel,
									listeners: {
										tap : function(thisButton, e, eOpts) {
											//console.error('tap',thisButton.getItemId());
											page.fireEvent(thisButton.getItemId(), page, thisButton, e, eOpts);
										}
									}
								});
								aryButton.push(tapButton);
								////console.error(rec.data.badge);
								if (rec.data.badge) {
									tapButton.setBadgeText("0");
								}
								break;
							case "tapCallOwner":
							case "tapAmbulance" :
							case "tapPolice" :
							case "tapManagement":
							case "tapCouncil" :
								if (isCallEnable) {
									tapButton = Ext.create('Ext.Button', {
										xtype: 'button',
										itemId: tapAction,
										disabled: !isEditable,
										showAnimation: 'popOut',
										cls: buttonCls,
										iconAlign: 'top',
										iconCls: rec.data.icon+' fa-2x',
										text : strLabel,
										listeners: {
											tap : function(thisButton, e, eOpts) {
												//console.error('tap',thisButton.getItemId());
												page.fireEvent(thisButton.getItemId(), page, thisButton, e, eOpts);
											}
										}
									});
									aryButton.push(tapButton);
								}
								break;
							default :
								tapButton = Ext.create('Ext.Button', {
									xtype: 'button',
									itemId: tapAction,
									disabled: !isEditable,
									showAnimation: 'popOut',
									cls: buttonCls,
									iconAlign: 'top',
									iconCls: rec.data.icon+' fa-2x',
									text : strLabel,
									listeners: {
										tap : function(thisButton, e, eOpts) {
											//console.error('tap',thisButton.getItemId());
											page.fireEvent(thisButton.getItemId(), page, thisButton, e, eOpts);
										}
									}
								});
								aryButton.push(tapButton);
								if (rec.data.badge) {
									tapButton.setBadgeText("0");
								}
								break;
							}
							}catch(ex){
								app.eh(ex,locMod);
							}
						}
						var breakLine=1;
						var rowPanel;
						var aryRow = [];
						//console.error('aryButton'+aryButton.length);
						for (var i = 0; i < aryButton.length; i++) {
							////console.error(breakLine);
							if (breakLine==1) {
								rowPanel = Ext.create('Ext.Panel',{
									layout : {
										type: 'hbox',
										pack: 'start',
										align: 'stretch'
									}
								});
								aryRow.push(rowPanel);
							}
							rowPanel.add(aryButton[i]);
							breakLine++;
							if (breakLine>4) {
								breakLine=1;
								
							}
						}
						for (var i = 0; i < aryRow.length; i++) {
							mainPanel.add(aryRow[i]);
						}
					}
				});
			}else{
				mainPage = Ext.create('mhelpdesk.view.MainPage2');
				var page = mainPage;
				var mainPanel = page.down('#mainPanel');
				var aryButton = [];
				
				var blnIsLogin = system.getIsLogin();
				var strLogin= "LOGIN";
				var clsLogin="fa-sign-in fa-2x";
				var isEditable = true;
				var isShow = false;
				if (blnIsLogin) {
					strLogin=locale.getText("tapLogout");	
					clsLogin="fa-sign-out fa-2x";
					isShow = true;
				}
				
				
				var buttonCls="r-main-button";
				//var aryButton = [];
				var localResidentIconStore = Ext.getStore('localResidentIconStore');
				localResidentIconStore.load({
					scope: this,
					callback: function(records,operation,success) {
						//console.error("OPERATION: "+records.length);
						for (var x = 0; x < records.length; x++) {
							try{
							var rec = records[x];
							//console.error(rec.data.action);
							var rec = records[x];
							var tapAction = rec.data.action;
							//console.error(tapAction);
							var tapButton=null;
							var strLabel = locale.getText(tapAction);
							switch (tapAction) {
							case "tapSosAlert" :
								if (isShow && system.getGroup()=='CLIENT') {
									tapButton = Ext.create('Ext.Button', {
										xtype: 'button',
										itemId: tapAction,
										disabled: !isEditable,
										showAnimation: 'popOut',
										cls: buttonCls,
										iconAlign: 'top',
										iconCls: rec.data.icon+' fa-2x r-red-color',
										text : strLabel,
										listeners: {
											tap : function(thisButton, e, eOpts) {
												//console.error('tap',thisButton.getItemId());
												page.fireEvent(thisButton.getItemId(), page, thisButton, e, eOpts);
											}
										}
									});
									me._tapMain=tapButton;
									aryButton.push(tapButton);
								}
								break;
							case "tapMain" :
								tapButton = Ext.create('Ext.Button', {
									xtype: 'button',
									itemId: tapAction,
									disabled: !isEditable,
									showAnimation: 'popOut',
									cls: buttonCls,
									iconAlign: 'top',
									iconCls: rec.data.icon+' fa-2x',
									text : strLabel,
									listeners: {
										tap : function(thisButton, e, eOpts) {
											//console.error('tap',thisButton.getItemId());
											page.fireEvent(thisButton.getItemId(), page, thisButton, e, eOpts);
										}
									}
								});
								me._tapMain=tapButton;
								aryButton.push(tapButton);
								break;
							case "tapTicket" :
								if (isShow && system.getGroup()=='CLIENT') {
									tapButton = Ext.create('Ext.Button', {
										xtype: 'button',
										itemId: tapAction,
										disabled: !isEditable,
										showAnimation: 'popOut',
										cls: buttonCls,
										iconAlign: 'top',
										iconCls: rec.data.icon+' fa-2x',
										text : strLabel,
										listeners: {
											tap : function(thisButton, e, eOpts) {
												//console.error('tap',thisButton.getItemId());
												page.fireEvent(thisButton.getItemId(), page, thisButton, e, eOpts);
											}
										}
									});
									me._tapTicket=tapButton;
									aryButton.push(tapButton);
									if (rec.data.badge) {
										tapButton.setBadgeText(0);
									}	
								}
								break;
							case "tapStatus" :
								if (isShow && system.getGroup()=='CLIENT') {
									tapButton = Ext.create('Ext.Button', {
										xtype: 'button',
										itemId: tapAction,
										disabled: !isEditable,
										showAnimation: 'popOut',
										cls: buttonCls,
										iconAlign: 'top',
										iconCls: rec.data.icon+' fa-2x',
										text : strLabel,
										listeners: {
											tap : function(thisButton, e, eOpts) {
												//console.error('tap',thisButton.getItemId());
												page.fireEvent(thisButton.getItemId(), page, thisButton, e, eOpts);
											}
										}
									});
									me._tapTicket=tapButton;
									aryButton.push(tapButton);
									if (rec.data.badge) {
										tapButton.setBadgeText(0);
									}
								}
								break;	
							case "tapLogin" :
								tapButton = Ext.create('Ext.Button', {
									xtype: 'button',
									itemId: tapAction,
									iconCls: clsLogin,
									text : strLogin,
									disabled: !isEditable,
									showAnimation: 'popOut',
									cls: buttonCls,
									iconAlign: 'top',
									listeners: {
										tap : function(thisButton, e, eOpts) {
											//console.error('tap',thisButton.getItemId());
											page.fireEvent(thisButton.getItemId(), page, thisButton, e, eOpts);
										}
									}
								});
								me._tapStatus=tapButton;
								aryButton.push(tapButton);
								if (rec.data.badge) {
									tapButton.setBadgeText(0);
								}	
								break;
							case "tapSetting" :
								tapButton = Ext.create('Ext.Button', {
									xtype: 'button',
									itemId: tapAction,
									showAnimation: 'popOut',
									cls: buttonCls,
									iconAlign: 'top',
									iconCls: rec.data.icon+' fa-2x',
									text : strLabel,
									listeners: {
										tap : function(thisButton, e, eOpts) {
											//console.error('tap',thisButton.getItemId());
											page.fireEvent(thisButton.getItemId(), page, thisButton, e, eOpts);
										}
									}
								});
								aryButton.push(tapButton);
								////console.error(rec.data.badge);
								if (rec.data.badge) {
									tapButton.setBadgeText("0");
								}
								break;
							case "tapNotification" :
								if (isShow) {
									tapButton = Ext.create('Ext.Button', {
										xtype: 'button',
										itemId: tapAction,
										disabled: !isEditable,
										showAnimation: 'popOut',
										cls: buttonCls,
										iconAlign: 'top',
										iconCls: rec.data.icon+' fa-2x',
										text : strLabel,
										listeners: {
											tap : function(thisButton, e, eOpts) {
												//console.error('tap',thisButton.getItemId());
												page.fireEvent(thisButton.getItemId(), page, thisButton, e, eOpts);
											}
										}
									});
									aryButton.push(tapButton);
								}
								break;
							default :
								tapButton = Ext.create('Ext.Button', {
									xtype: 'button',
									itemId: tapAction,
									disabled: !isEditable,
									showAnimation: 'popOut',
									cls: buttonCls,
									iconAlign: 'top',
									iconCls: rec.data.icon+' fa-2x',
									text : strLabel,
									listeners: {
										tap : function(thisButton, e, eOpts) {
											//console.error('tap',thisButton.getItemId());
											page.fireEvent(thisButton.getItemId(), page, thisButton, e, eOpts);
										}
									}
								});
								aryButton.push(tapButton);
								if (rec.data.badge) {
									tapButton.setBadgeText("0");
								}
								break;
							}
							}catch(ex){
								app.eh(ex,locMod);
							}
						}
						var breakLine=1;
						var rowPanel;
						var aryRow = [];
						//console.error('aryButton'+aryButton.length);
						for (var i = 0; i < aryButton.length; i++) {
							////console.error(breakLine);
							if (breakLine==1) {
								rowPanel = Ext.create('Ext.Panel',{
									layout : {
										type: 'hbox',
										pack: 'start',
										align: 'stretch'
									}
								});
								aryRow.push(rowPanel);
							}
							rowPanel.add(aryButton[i]);
							breakLine++;
							if (breakLine>3) {
								breakLine=1;
								
							}
						}
						for (var i = 0; i < aryRow.length; i++) {
							mainPanel.add(aryRow[i]);
						}
					}
				});
			}
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
	               	items : [mainPage]
	            }, {
					xtype : 'panel',
					itemId : 'lblDebug',
					docked : 'bottom',
					//height : 25,
					cls: 'r-footer',
					layout: {
						type: 'vbox',
						pack: 'center',
						align: 'stretch'
					},
					html : me.getDefaultLabel()
	            }
            ]);
            
            var navBar = me.getNavigationBar();
            //console.info(navBar);
            var backButton = Ext.create('Ext.Button', {
            	itemId: 'btnBack',
            	width : 45,
                iconCls: 'fa-undo',
                iconAlign : 'top',
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
				style : 'font-family: "FontAwesome"; text-align: center; padding-left: 10px !important',
				xtype : "button",
				cls : 'r-main-menu',
				text : me.txtMenu,
				name : "btnMenuMain",
				itemId : 'btnMenuMain',
				iconAlign : 'top',
				ui : "plain",
				hidden: false,
				align : 'left'// ,
			});
			this.callParent(arguments);
		}catch(ex){
			//console.error(ex);
			app.eh(ex,locMod);
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
		var company = system.getCompanyName();
		if (!company) {
			company = "";	
		}
		var strHtml = company+"&nbsp;&nbsp;"+locale.getText('ContactUs')+'&nbsp;&nbsp;&nbsp;<a href="mailto:'
				+system.getEmail()+'"><i class="fa fa-envelope-o fa-1x"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="tel:'
				+system.getPhone()+'"><i class="fa fa-phone fa-1x"></i></a> ';
		return strHtml;
		
		
	}
});
