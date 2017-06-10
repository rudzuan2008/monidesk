system=mhelpdesk.view.System;
locale=mhelpdesk.view.Locale;
Ext.define('mhelpdesk.controller.MainController', {
	extend : 'Ext.app.Controller',

	requires : ['mhelpdesk.view.SosPage'],
	_debugModule : 'Main',
	_debugLine : 0,
	_screenMode : 0,
	_deviceOS : 'Default',
	_browser : 'Default',
	_deviceType : 'Default',
	_connection : 'Default',
	_build : '0.0',
	_def_company_id : 2,
	_currentPage : null,
	_currentView : null,
	_menuOpen : false,
	_menuCurrent : '',
	_dateDisplayFormat : 'd-m-Y',
	_dateTimeDisplayFormat : 'd-m-Y H:i:s',
	_menu : null,
	_isPlaying : false,
	_soundMedia : null,
	_isPullProcess : false,
	_isPlaying : false,
	_isDebug : true,
	_onSound : true,
	_devicePath : null,
	_deviceFileSystem : null,
	_pathMenuMain : null,
	_ticketId : null,
	_id : null,
	_email : null,
	_countNav : 0,
	_lang : 'en',
	_session : null,
	_socket : null,
	config : {
		itemId : 'controller',
		refs : {
			main : 'main',
			navBar: 'main #navbar',
			//navBar : 'main #navbar',
			mainpage : 'mainpage',
			mainPage2 : 'mainPage2',
			guardPage : 'guardPage',
			homepage : 'homepage',
			sospage : 'sospage',
			sosAction : 'sosAction',
			visitorPage : 'visitorPage',
			registerVisitor : 'registerVisitor',
			login : 'login',
			timetable : 'timetable',
			timetableNew : 'timetableNew',
			timetableList : 'timetableList',
			occupantList : 'occupantList',
			systemConfig : 'systemConfig',
			fileUpload : 'fileUpload',
			search : 'search',
			faqList : 'faqList',
			ticket : 'ticket',
			status : 'status',
			sosList : 'sosList',
			ticketList : 'ticketList',
			notification : 'notification',
			event : 'event',
			viewTicket : 'viewTicket',
			userTicket : 'userTicket',
			postMessage : 'postMessage',
			messageList : 'messageList',
			noticeTicket : 'noticeTicket',
			noticeTicketFail : 'noticeTicketFail',
			pathMenu : 'button[pathButtonType=menuitem]',
			pathMenuMenu : 'button[pathButtonType=menu]',
			fileBtn : 'fileUpload #fileBtn1',
			btnMenuMain : 'main #btnMenuMain',
			btnLogin : 'login #btnLogin',
			fileBtnPostMessage : 'postMessage #fileBtn',
			fileBtnTicket : 'ticket #fileBtnTicket',
			btnReturnMain : 'button[name=btnReturnMain]'
		},
		control : {
			// 'button[pathButtonType=menuitem]': {
			pathMenu : {
				itemtap : 'onPathMenuItemTap'
			},
			pathMenuMenu : {
				menuOpen : 'onPathMenuOpen',
				menuClose : 'onPathMenuClose'
			},
			btnMenuMain : {
				tap: function(btn, e, eOpts){
					//console.error("menu tap");
					var me = this;
					me.playSound("menu");
				}
			},
			btnLogin : {
				tap: function(btn, e, eOpts){
					var me = this;
					var locMod = "controller.btnLogin.tap";
					me.dh(locMod,"debug", 'Start','...');
					var thisPage = me.getLogin();
					var isValid = true;
					var errors = new Array();
					var form = thisPage; // newnotification
					var errLabel = thisPage.down('#errorMessage');
					var fields = form.getValues();
					var rememberFlag = fields['keepUser'];
					if (fields['username'] == "") {
						isValid = false;
						errors.push({
							field : 'username',
							reason : locale.getText("fieldEmpty")
						});
					}
					if (fields['password'] == "") {
						isValid = false;
						errors.push({
							field : 'password',
							reason : locale.getText("fieldEmpty")
						});
					}
					if (isValid) {
						console.error('Login Valid '+fields['username']+fields['password']);
						me.showMyMasked(locale.getText('waitProcess'),false);
						var flag = false;
						var msg = locale.getText('msgNoticeFail');
						if (fields['usertype']=='client') {
							Ext.Ajax.request({
								useDefaultXhrHeader : false,
								//timeout : 5000,
								scope : me,
								url : system.getPortalServer() + 'mloginclient.php',
								method : 'post',
								params : {
									username : fields['username'],
									passwd : fields['password']
								},
								success : function(response) {
									if (response) {
										var dataResponse = me.getJSON(response.responseText);
										if (dataResponse) {
											msg = dataResponse.message;
											if (dataResponse.success) {
												me._group = dataResponse.role;
												me._email = dataResponse.email;
												me._id = dataResponse.id;
												me._fullname = dataResponse.fullname;
												me.updSysSetting('last_clientid',me._id);
												me.updSysSetting('user',me._email);
												me.updSysSetting('fullname',me._fullname);
												me.updSysSetting('group',me._group);
												console.error(me._fullname);
												flag = true;
											}
										}
									}
									doProcess(flag,msg);
								},
								failure : function(response) {
									
									if (response) {
										//console.error(response);
										var dataResponse = me.getJSON(response.responseText);
										if (dataResponse) {
											msg = response.responseText;
										}
									}
									doProcess(false,msg);								
								}
							});
						}else{
							Ext.Ajax.request({
								useDefaultXhrHeader : false,
								//timeout : 5000,
								scope : me,
								url : system.getPortalServer() + 'admin/mloginstaff.php',
								method : 'post',
								params : {
									username : fields['username'],
									passwd : fields['password']
								},
								success : function(response) {
									if (response) {
										var dataResponse = me.getJSON(response.responseText);
										if (dataResponse) {
											msg = dataResponse.message;
											if (dataResponse.success) {
												me._user = dataResponse.user;
												me._group = dataResponse.role;
												me._fullname = dataResponse.fullname;
												me._email = dataResponse.email;
												me._id = dataResponse.id;
												me.updSysSetting('last_clientid',me._id);
												me.updSysSetting('user',me._user);
												me.updSysSetting('fullname',me._fullname);
												me.updSysSetting('group',me._group);
												//console.error(me._fullname);
												flag = true;
											}
										}
									}
									doProcess(flag,msg);
								},
								failure : function(response) {
									
									if (response) {
										//console.error(response);
										var dataResponse = me.getJSON(response.responseText);
										if (dataResponse) {
											msg = response.responseText;
										}
									}
									doProcess(false,msg);								
								}
							});
							
						}
					}else{
						var errStr="";
						Ext.each(errors, function(error, index) {
							errStr += "[" + (index + 1) + "] - " + error.field + " "
									+ error.reason + "<br>";
						});	
						doProcess(false, errStr);	
					}
					function doProcess(flag,msg) {
						me.hideMyMasked();
						console.error(flag+":"+msg);
						if (flag) {
							me.updSysSetting('login_flag',1);
							me.clearCache();
						}else{
							me.updSysSetting('login_flag',0);
							thisPage.displayError(msg);
						}
						me.updSysSetting('login_remember', rememberFlag);

					}
				}
			},
			'button' : {
				tap: function(btn, e, eOpts) {
					//console.error("button tap");
					var me = this;
					me.playSound("button-tap");
				}
			},
			'menu > button' : {
				tap : function(btn, e, eOpts) {
					var locMod = btn.getItemId()+'.tap';
					var me = this;
					try {
						if (this._menuOpen) {
							Ext.Viewport.hideAllMenus();
							this._menuOpen = false;
						}
						var menuText = btn.getItemId(); // btn.menu;
						//console.log("2: MENU from ItemID:" + menuText);
						app.dh('Menu Click',menuText,locMod);
						var navMain = me.getMain();
						this._currentPage = null;
						if (menuText) {
							app.dh('Menu','Click',menuText, locMod);
							switch (menuText) {
								case "mnuHome" :
									me.gotoHome();
									break;
								case "menuHome99" :
									me.popPage();
									break;
								case "mnuLogout" :
									me.doLogout();
									break;
								case "mnuSOS" :
									me.doSOS();
									break;
								case "mnuExternalCall" :
									if (me._deviceOS == "Android" || me._deviceOS == "iOS") {
										//var link="tel:8344396856";
	          							//window.location.href = link;
	          							//me._session.call();
										me.call(true);
									}else{
										me.showMsgBoxOK(locale.getAlertText(),'Only applicable on mobile device!',Ext.MessageBox.ERROR,true);
									}
									break;
								case "mnuReturn" :
									if (this._menuOpen) {
										Ext.Viewport.hideAllMenus();
										this._menuOpen = false;
					
									} else {
										this._menuOpen = true;
										Ext.Viewport.setMenu(me._menu, {
													side : 'left',
													reveal : true
												});
										Ext.Viewport.toggleMenu("left");
									}
									break;
								default :
									me._currentPage = this.getCurrentPage(menuText);
									//console.error(me._currentPage);
									if (me._currentPage == null) {
									} else {
										console.error(me._currentPage.getItemId());
										switch (me._currentPage.getItemId()) {
											case "login" :
												me.pushPage(me._currentPage);
												break;
											case "systemConfig" :
												var mainPage = me.getMainPage2();
												//mainPage.setActiveItem(5);
												var page = Ext.create('mhelpdesk.view.SystemConfig');
												me.pushPage(page);
												break;
											case "mainpage" :
												me.gotoHome();
												break;
											case "intercom" :
												me.pushPage(me._currentPage);
												break;
												
										}
									}
									break;
							}
						}
					} catch (ex) {
						console.log("ERROR: menu>button " + ex);
					}
				}
			},
			btnReturnMain : {
				tap : function(btn, e, eOpts) {
					var locMod = 'btnReturnMain.tap';
					var me = this;
					me.gotoHome();
				}
			},
			mainPage2 : {
				tapMain : function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+'.tapMain';
					app.dh('Start','...',locMod);
					if (!me._MenuHome) {
						me._MenuHome = Ext.create('mhelpdesk.component.MenuHome');
					}
					me._menu = me._MenuHome;
					me.setMenuHome(me._menu);
				},
				tapTicket : function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+'.tapTicket';
					app.dh('Start','...',locMod);
					if (!me._MenuHome) {
						me._MenuHome = Ext.create('mhelpdesk.component.MenuHome');
					}
					me._menu = me._MenuHome;
					me.setMenuHome(me._menu);
					var ticketForm = Ext.create('mhelpdesk.view.Ticket');	
					me.pushPage(ticketForm);
					//var ticketForm = me.getTicket();
					if (system.getIsLogin()) {
						me.load_client(system.getLastId(), false,
							function(records,operation,success) {
								if (success && records.length>0) {
									var record = records[0];
									var client_id = record.get('client_id');
									ticketForm.down('#name').setValue(record.get('client_firstname')+" "+record.get('client_lastname'));
									ticketForm.down('#email').setValue(record.get('client_email'));
									var phone = record.get('client_phone');
									if (!phone) {
										phone = record.get('client_mobile');	
									}
									ticketForm.down('#phone').setValue(phone);
									
									me.load_product(client_id, true, function(recordsProduct,operation, success) {
										if (recordsProduct.length > 0) {
											var recordProduct = recordsProduct[0];
											ticketForm.down('#asset_id').setValue(recordProduct.get('asset_id'));
										}else{	
											me.showMsgBoxOK(locale.getAlertText(),'You do NOT have unit no associate to you, please ask management',
												Ext.MessageBox.ERROR,false);
											me.clearStore(me._localProductStore);	
										}
									});
								}
								
						});
					}
				},
				tapEvent: function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+'.tapEvent';
					app.dh('Start','...',locMod);
					if (!me._MenuActivity) {
						me._MenuActivity = Ext.create('mhelpdesk.component.MenuActivity');
					}
					me._menu = me._MenuActivity;

					me.setMenuActivity(me._menu);
					var page = Ext.create('mhelpdesk.view.EventPage');	
					me.pushPage(page);
				},
				tapStatus: function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+'.tapEvent';
					app.dh('Start','...',locMod);
					if (!me._MenuHome) {
						me._MenuHome = Ext.create('mhelpdesk.component.MenuHome');
					}
					me._menu = me._MenuHome;
					me.setMenuHome(me._menu);
					var filter="ticket.status='open' AND ticket.client_id="+system.getLastId()+" AND ticket.topic_id <> 2";
					utils.showMyMasked(locale.getText('msgWaitPage'),false);
					me.getTicketByFilter(filter,true,function(){
						var page = Ext.create('mhelpdesk.view.StatusPage');	
						me.pushPage(page);
						utils.hideMyMasked();
					});
					
				},
				tapNotification: function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+'.tapEvent';
					app.dh('Start','...',locMod);
					if (!me._MenuNotification) {
						me._MenuNotification = Ext.create('mhelpdesk.component.MenuNotification');
					}
					me._menu = me._MenuNotification;

					me.setMenuNotification(me._menu);
					var page = Ext.create('mhelpdesk.view.NotificationPage');	
					me.pushPage(page);
				},
				tapLogin: function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+'.tapVisitor';
					app.dh('Start','..',locMod);
					if (system.getIsLogin()) {
						me.doLogout();
					}else{
						var loginPage = Ext.create("mhelpdesk.view.Login");
						me.pushPage(loginPage);
					}
					
				},
				tapSetting: function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+'.tapVisitor';
					app.dh('Start','..',locMod);
					if (!me._MenuHome) {
						me._MenuHome = Ext.create('mhelpdesk.component.MenuHome');
					}
					me._menu = me._MenuHome;
					me.setMenuHome(me._menu);
					var page = Ext.create('mhelpdesk.view.SystemConfig');	
					me.pushPage(page);
				},
				tapSosAlert: function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+'.tapSosAlert';
					app.dh('Start','..',locMod);
					me.doSOS();
				}
				
			},
			mainpage : {
				activeitemchange : function(thisPage, tabItem, oldValue, eOpts) {
					
					var me = this;
					var locMod = 'mainpage';
					me.debugHandler(locMod,"info",locMod);
					//console.log("TAB CLICK:" + tabItem);
					app.dh('Tab Change',tabItem.getItemId(), thisPage.getItemId(),locMod);
					if (tabItem == 0) {
						// nothing to do
					} else {
						//console.log('tab change ' + tabItem.getItemId());
						// if (!me._isPlaying) { me.playSound('button-tap');}
						// navigator.vibrate(250);
						switch (tabItem.getItemId()) {
							case "tabHome" :
								if (!me._MenuHome) {
									me._MenuHome = Ext.create('mhelpdesk.component.MenuHome');
								}
								me._menu = me._MenuHome;
								me.setMenuHome(me._menu);
								break;
							case "tabSchedule" :
								me.debugHandler(locMod, "info",
										"Filter timetable date", me
												.getTodayDate());

								me.filter_store("localDailyTimetableStore",
										"fdate", me.getTodayDate());
								break;
							case "tabSetup" :
								if (!me._MenuHome) {
									me._MenuHome = Ext.create('mhelpdesk.component.MenuHome');
								}
								me._menu = me._MenuHome;
								me.setMenuHome(me._menu);
								var systemConfig = me.getSystemConfig();
								//systemConfig.initData();
								break;
							case "tabTicket" :
								if (!me._MenuHome) {
									me._MenuHome = Ext.create('mhelpdesk.component.MenuHome');
								}
								me._menu = me._MenuHome;
								me.setMenuHome(me._menu);
								var ticketForm = me.getTicket();
								if (system.getIsLogin()) {
									me.load_client(system.getLastId(), false,
										function(records,operation,success) {
											if (success && records.length>0) {
												var record = records[0];
												var client_id = record.get('client_id');
												ticketForm.down('#name').setValue(record.get('client_firstname')+" "+record.get('client_lastname'));
												ticketForm.down('#email').setValue(record.get('client_email'));
												var phone = record.get('client_phone');
												if (!phone) {
													phone = record.get('client_mobile');	
												}
												ticketForm.down('#phone').setValue(phone);
												
												me.load_product(client_id, true, function(recordsProduct,operation, success) {
													if (recordsProduct.length > 0) {
														var recordProduct = recordsProduct[0];
														ticketForm.down('#asset_id').setValue(recordProduct.get('asset_id'));
													}else{	
														me.showMsgBoxOK(locale.getAlertText(),'You do NOT have unit no associate to you, please ask management',
															Ext.MessageBox.ERROR,false);
														me.clearStore(me._localProductStore);	
													}
												});
											}
											
									});
								}
								break;
							case "tabStatus" :
								if (!me._MenuHome) {
									me._MenuHome = Ext.create('mhelpdesk.component.MenuHome');
								}
								me._menu = me._MenuHome;
								me.setMenuHome(me._menu);
								
								break;
							case "tabNotification" :
								if (!me._MenuNotification) {
									me._MenuNotification = Ext.create('mhelpdesk.component.MenuNotification');
								}
								me._menu = me._MenuNotification;

								me.setMenuNotification(me._menu);
								break;
							case "tabEvent" :
								if (!me._MenuActivity) {
									me._MenuActivity = Ext.create('mhelpdesk.component.MenuActivity');
								}
								me._menu = me._MenuActivity;

								me.setMenuActivity(me._menu);
								break;
							case "tabSetting" :
								if (!me._MenuHome) {
									me._MenuHome = Ext.create('mhelpdesk.component.MenuHome');
								}
								me._menu = me._MenuHome;
								me.setMenuHome(me._menu);
								
								break;
								
						}
					}
				}
				
			},
			sospage : {
				close: function(page, thisButton, e, eOpts) {
					this.popPage();	
				},
				filter : function(page, thisButton, e, eOpts) {
					var me = this;
					var locMod = page.getItemId()+'.filter';
					app.dh('Start','...',locMod);
					
					var selection = page.down('#selection').getValue();
					if (selection=="status") {
						var status = page.down('#filterStatus').getValue();
						me.getTicketBySOS("ticket.status='"+status+"'",true, function(records,operation,success){
							
						});
					}else if (selection=="name"){
						var name = page.down('#filterText').getValue();
						me.getTicketBySOS("ticket.name LIKE '"+name+"%'",true, function(records,operation,success){
							
						});
					}else if (selection=="serial_no") {
						var unit = page.down('#filterText').getValue();
						me.getTicketBySOS("asset.seral_no='"+unit+"'",true, function(records,operation,success){
							
						});
					}else if (selection=="created") {
						var dateCreated = page.down('#filterText').getValue();
						me.getTicketBySOS("ticket.created LIKE '"+dateCreated+"%'",true, function(records,operation,success){
							
						});
					}else{
						
					}
				}
				
			},
			sosAction : {
				close: function(page, thisButton, e, eOpts) {
					this.popPage();	
				},
				callresident : function(thisPage, clientId, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+'.callresident';
					app.dh('Start','...',locMod);
					var localAllClientStore = Ext.getStore('localAllClientStore');
					var record = utils.findRecord(localAllClientStore,'client_id',clientId);
					var tel;
					if (record) {
						if (record.data.client_mobile) tel=record.data.client_mobile;
						if (!tel) {
							if (record.data.client_phone) tel=record.data.client_phone;
						}
						var message ="Guard ("+system.getUser()+") make a call to resident."
						utils.showMyMasked(locale.getText('waitProcess'),false);
						me.doGuardResponse(ticket_id,message,function(msg,success){
							if (success) {
								utils.showMsgBoxOK(locale.getSuccessText(), locale.getText(msg), Ext.MessageBox.INFO, true);
							}
							utils.hideMyMasked();
						});
					}
					if (tel) {
						me.doCall(tel, 'Resident');
					}else{
						utils.showMsgBoxOK(locale.getFailText(),locale.getText('Sorry no phone number found'), Ext.MessageBox.ERROR, false); 
					}
					
				},
				callmanagement : function(thisPage, thisButton, e, eOpts){
					var me = this;
					var locMod = thisPage.getItemId()+'.callmanagement';
					app.dh('Start','...',locMod);
					var tel = system.getManagement();
					me.doCall(tel, 'Management');
					var message ="Guard ("+system.getUser()+") make a call to management."
					utils.showMyMasked(locale.getText('waitProcess'),false);
					me.doGuardResponse(ticket_id,message,function(msg,success){
						if (success) {
							utils.showMsgBoxOK(locale.getSuccessText(), locale.getText(msg), Ext.MessageBox.INFO, true);
						}
						utils.hideMyMasked();
					});
				},
				visit: function(thisPage, ticket_id, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+'.visit';
					app.dh('Start','...',locMod);
					try {
						var message ="Guard ("+system.getUser()+") is visiting the unit for checking."
						utils.showMyMasked(locale.getText('waitProcess'),false);
						me.doGuardResponse(ticket_id,message,function(msg,success){
							if (success) {
								utils.showMsgBoxOK(locale.getSuccessText(), locale.getText(msg), Ext.MessageBox.INFO, true);
							}
							utils.hideMyMasked();
						});
					}catch(ex){
						app.eh(ex,locMod);
						
					}
				}
			},
			statusPage : {
				filter: function(thisPage,type,thisSelection,value) {
					var me = this;
					var locMod = thisPage.getItemId()+'.filter';
					app.dh('Start','...',locMod);
					var filter;
					console.error(type);	
					if (type=='status') {
						if (value=='sos') {
							filter="ticket.topic_id=2 AND ticket.client_id="+system.getLastId();
						}else{
							filter="ticket.status='"+value+"' AND ticket.client_id="+system.getLastId()+" AND ticket.topic_id <> 2";
						}
						
					}else{
						var datePicker = Ext.ComponentQuery.query("#filterText")[0]; // thisPage.query('datepickerfield[name=filterText]');
						var dt = datePicker.getValue();
						var strDate = Ext.Date.format(dt, 'Y-m-d');
						filter="ticket.created LIKE '"+strDate+"%'"+"' AND ticket.client_id="+system.getLastId()+" AND ticket.topic_id <> 2";
					}
					if (filter)
						utils.showMyMasked(locale.getText('msgWaitPage'),false);
						me.getTicketByFilter(filter, true, function(){
							utils.hideMyMasked();
						});
				}
			},
			visitorPage : {
				tapBack: function(thisPage, thisButton, e, eOpts) {
					this.popPage();
				},
				tapRegister : function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+'.tapRegister';
					app.dh('Start','...',locMod);
					var page = Ext.create('mhelpdesk.view.visitor.Register');
					me.pushPage(page);
				},
				tapVisitorList:function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+'.tapVisitorList';
					app.dh('Start','...',locMod);
					
					me.getTicketByVisitor("ticket.status='open'",true, function(records,operation,success){
						if (records.length>0) {
							var page = Ext.create('mhelpdesk.view.VisitorListPage');
							me.pushPage(page);
						}
					});
					
					
				},
				tapVisitorPass:function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+'.tapVisitorPass';
					app.dh('Start','...',locMod);
				},
				tapDeliveryVehicle:function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+'.tapDeliveryVehicle';
					app.dh('Start','...',locMod);
					
					var page = Ext.create('mhelpdesk.view.visitor.RegisterDelivery');
					me.pushPage(page);
				}
			},
			registerVisitor: {
				close : function(page, thisButton, e, eOpts) {
					this.popPage();
				},
				camera : function(page, thisButton, e, eOpts) {
					var me = this;
					var locMod = page.getItemId()+'.camera';
					app.dh('Start','...',locMod);
					
					var file_path = page.down('#img_path');
			        var loadedImage = page.down('#loadedImage');
					//me.fireEvent('openCamera', thisButton, file_path, loadedImage);
					me.getPhoto(thisButton,file_path,loadedImage);
					
				},
				callresident : function(thisPage, clientId, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+'.callresident';
					app.dh('Start','...',locMod);
					var localAllClientStore = Ext.getStore('localAllClientStore');
					var record = utils.findRecord(localAllClientStore,'client_id',clientId);
					var tel;
					if (record) {
						if (record.data.client_mobile) tel=record.data.client_mobile;
						if (!tel) {
							if (record.data.client_phone) tel=record.data.client_phone;
						}
						var message ="Guard ("+system.getUser()+") make a call to resident."
						utils.showMyMasked(locale.getText('waitProcess'),false);
						me.doGuardResponse(ticket_id,message,function(msg,success){
							if (success) {
								utils.showMsgBoxOK(locale.getSuccessText(), locale.getText(msg), Ext.MessageBox.INFO, true);
							}
							utils.hideMyMasked();
						});
					}
					if (tel) {
						me.doCall(tel, 'Resident');
					}else{
						utils.showMsgBoxOK(locale.getFailText(),locale.getText('Sorry no phone number found'), Ext.MessageBox.ERROR, false); 
					}
					
				},
				callmanagement : function(thisPage, thisButton, e, eOpts){
					var me = this;
					var locMod = thisPage.getItemId()+'.callmanagement';
					app.dh('Start','...',locMod);
					var tel = system.getManagement();
					me.doCall(tel, 'Management');
					var message ="Guard ("+system.getUser()+") make a call to management."
					utils.showMyMasked(locale.getText('waitProcess'),false);
					me.doGuardResponse(ticket_id,message,function(msg,success){
						if (success) {
							utils.showMsgBoxOK(locale.getSuccessText(), locale.getText(msg), Ext.MessageBox.INFO, true);
						}
						utils.hideMyMasked();
					});
				},
				save : function( thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+'.callmanagement';
					app.dh('Start','...',locMod);
					
					var fields = thisPage.getValues();
					
					var unitNo = fields['asset_unit'];
					var imgFile = fields['img_path'];
					var visitor = fields['name'];
					var contactNo = fields['phone'];
					var vehicleNo = fields['vehicle'];
					var pass = fields['pass'];
					
					console.error(imgFile);
					var localAllClientStore = Ext.getStore('localAllClientStore');
					var record = utils.findRecord(localAllClientStore,'asset_unit',unitNo);
					if (record) {
						var isValid = true;
						var errors = new Array();
						if (!imgFile) {
							isValid = true;
							errors.push({
								field : locale.getText('Picture'),
								reason : locale.getText("fieldEmpty")
							});
						}
						if (!visitor) {
							isValid = false;
							errors.push({
								field : locale.getText('Visitor'),
								reason : locale.getText("fieldEmpty")
							});
						}
						if (!contactNo) {
							isValid = false;
							errors.push({
								field : locale.getText('Contact No'),
								reason : locale.getText("fieldEmpty")
							});
						}
						if (!vehicleNo) {
							isValid = false;
							errors.push({
								field : locale.getText('Vehicle No'),
								reason : locale.getText("fieldEmpty")
							});
						}
						if (!pass) {
							isValid = false;
							errors.push({
								field : locale.getText('Pass No'),
								reason : locale.getText("fieldEmpty")
							});
						}
						if (isValid) {
							var client_id = record.data.client_id;
							var subject = "New Visitor on Unit "+record.data.asset_unit+" ("+record.data.fullname+")";							
							var message = "Visitor Name:"+visitor+", Vehicle:"+vehicleNo+" Using Pass No: "+pass;
							var topic_id = 4;
							me.doActionTicket(client_id,subject,message,visitor,contactNo,vehicleNo,pass,topic_id,
								function(msg, success){
									if (success) {
										me.popPage();
									}else{
										utils.showMsgBoxOK(locale.getAlertText(),msg, Ext.MessageBox.ERROR, false);
									}
								});							
						}else{
							var strError = utils.getErrors(errors);
							utils.showMsgBoxOK(locale.getAlertText(),strError, Ext.MessageBox.ERROR, false);
						}
					}else{
						utils.showMsgBoxOK(locale.getAlertText(),locale.getText('Resident information NOT found!'), Ext.MessageBox.ERROR, false);
					}
				}
			},
			registerDelivery: {
				close : function(page, thisButton, e, eOpts) {
					this.popPage();
				},
				camera : function(page, thisButton, e, eOpts) {
					var me = this;
					var locMod = page.getItemId()+'.camera';
					app.dh('Start','...',locMod);
					
					var file_path = page.down('#img_path');
			        var loadedImage = page.down('#loadedImage');
					//me.fireEvent('openCamera', thisButton, file_path, loadedImage);
					me.getPhoto(thisButton,file_path,loadedImage);
					
				},
				callresident : function(thisPage, clientId, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+'.callresident';
					app.dh('Start','...',locMod);
					var localAllClientStore = Ext.getStore('localAllClientStore');
					var record = utils.findRecord(localAllClientStore,'client_id',clientId);
					var tel;
					if (record) {
						if (record.data.client_mobile) tel=record.data.client_mobile;
						if (!tel) {
							if (record.data.client_phone) tel=record.data.client_phone;
						}
						var message ="Guard ("+system.getUser()+") make a call to resident."
						utils.showMyMasked(locale.getText('waitProcess'),false);
						me.doGuardResponse(ticket_id,message,function(msg,success){
							if (success) {
								utils.showMsgBoxOK(locale.getSuccessText(), locale.getText(msg), Ext.MessageBox.INFO, true);
							}
							utils.hideMyMasked();
						});
					}
					if (tel) {
						me.doCall(tel, 'Resident');
					}else{
						utils.showMsgBoxOK(locale.getFailText(),locale.getText('Sorry no phone number found'), Ext.MessageBox.ERROR, false); 
					}
					
				},
				callmanagement : function(thisPage, thisButton, e, eOpts){
					var me = this;
					var locMod = thisPage.getItemId()+'.callmanagement';
					app.dh('Start','...',locMod);
					var tel = system.getManagement();
					me.doCall(tel, 'Management');
					var message ="Guard ("+system.getUser()+") make a call to management."
					utils.showMyMasked(locale.getText('waitProcess'),false);
					me.doGuardResponse(ticket_id,message,function(msg,success){
						if (success) {
							utils.showMsgBoxOK(locale.getSuccessText(), locale.getText(msg), Ext.MessageBox.INFO, true);
						}
						utils.hideMyMasked();
					});
				},
				save : function( thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+'.callmanagement';
					app.dh('Start','...',locMod);
					
					var fields = thisPage.getValues();
					
					var unitNo = fields['asset_unit'];
					var imgFile = fields['img_path'];
					var visitor = fields['name'];
					var contactNo = fields['phone'];
					var vehicleNo = fields['vehicle'];
					var pass = fields['pass'];
					
					console.error(imgFile);
					var localAllClientStore = Ext.getStore('localAllClientStore');
					var record = utils.findRecord(localAllClientStore,'asset_unit',unitNo);
					if (record) {
						var isValid = true;
						var errors = new Array();
						if (!imgFile) {
							isValid = true;
							errors.push({
								field : locale.getText('Picture'),
								reason : locale.getText("fieldEmpty")
							});
						}
						if (!visitor) {
							isValid = false;
							errors.push({
								field : locale.getText('Visitor'),
								reason : locale.getText("fieldEmpty")
							});
						}
						if (!contactNo) {
							isValid = false;
							errors.push({
								field : locale.getText('Contact No'),
								reason : locale.getText("fieldEmpty")
							});
						}
						if (!vehicleNo) {
							isValid = false;
							errors.push({
								field : locale.getText('Vehicle No'),
								reason : locale.getText("fieldEmpty")
							});
						}
						if (!pass) {
							isValid = false;
							errors.push({
								field : locale.getText('Pass No'),
								reason : locale.getText("fieldEmpty")
							});
						}
						if (isValid) {
							var client_id = record.data.client_id;
							var subject = "New Delivery on Unit "+record.data.asset_unit+" ("+record.data.fullname+")";							
							var message = "Delivery Name:"+visitor+", Vehicle:"+vehicleNo+" Using Pass No: "+pass;
							var topic_id = 5;
							me.doActionTicket(client_id,subject,message,visitor,contactNo,vehicleNo,pass,topic_id, function(msg, success){
								if (success) {
									me.popPage();
								}else{
									utils.showMsgBoxOK(locale.getAlertText(),msg, Ext.MessageBox.ERROR, false);
								}
							});
							
							
						}else{
							var strError = utils.getErrors(errors);
							utils.showMsgBoxOK(locale.getAlertText(),strError, Ext.MessageBox.ERROR, false);
						}
					}else{
						utils.showMsgBoxOK(locale.getAlertText(),locale.getText('Resident information NOT found!'), Ext.MessageBox.ERROR, false);
					}
				}
			},
			visitorListPage: {
				close: function(page, thisButton, e, eOpts) {
					this.popPage();	
				},
				filter : function(page, thisButton, e, eOpts) {
					var me = this;
					var locMod = page.getItemId()+'.filter';
					app.dh('Start','...',locMod);
					
					var selection = page.down('#selection').getValue();
					if (selection=="status") {
						var status = page.down('#filterStatus').getValue();
						me.getTicketByVisitor("ticket.status='"+status+"'",true, function(records,operation,success){
							
						});
					}else if (selection=="name"){
						var name = page.down('#filterText').getValue();
						me.getTicketByVisitor("ticket.name LIKE '"+name+"%'",true, function(records,operation,success){
							
						});
					}else if (selection=="serial_no") {
						var unit = page.down('#filterText').getValue();
						me.getTicketByVisitor("asset.seral_no='"+unit+"'",true, function(records,operation,success){
							
						});
					}else if (selection=="created") {
						var dateCreated = page.down('#filterText').getValue();
						me.getTicketByVisitor("ticket.created LIKE '"+dateCreated+"%'",true, function(records,operation,success){
							
						});
					}else{
						
					}
				}
				
			},
			guardPage : {
				activate: function( newActiveItem, thisPage, oldActiveItem, eOpts ) {
					var me = this;
					var locMod = thisPage.getItemId()+'.show';
					app.dh('Start','...',locMod);
					me.getTicketBySOS("ticket.status='open'",false, function(records,operation,success){
						console.error(records.length);
						if (records.length>0) {
							var sos = thisPage.down('#sosMain');
							sos.setBadgeText(records.length);
						}		
					});
				},
				tapCallOwner : function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+'.tapCallOwner';
					app.dh('Start','...',locMod);
					var page = Ext.create('mhelpdesk.view.OccupantPage');	
					utils.showMyMasked(locale.getText('msgWaitPage'),false);
					me.load_all_client(false,function(records,operation,success){
						me.pushPage(page);
						utils.hideMyMasked();
					});
					
				},
				tapAmbulance : function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+'.tapAmbulance';
					app.dh('Start',system.getAmbulance(),locMod);
					app.dh('Start','...',locMod);
					var tel = system.getAmbulance();
					me.doCall(tel,'Ambulance');
				},
				tapPolice : function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+'.tapPolice';
					app.dh('Start','...',locMod);
					var tel = system.getPolice();
					me.doCall(tel,'Police');
				},
				tapManagement: function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+'.tapManagement';
					app.dh('Start','...',locMod);
					var tel = system.getManagement();
					me.doCall(tel, 'Management');
				},
				tapCouncil : function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+'.tapCouncil';
					app.dh('Start','...',locMod);
					var tel = system.getCouncil();
					me.doCall(tel, 'Council');
				},
				tapSos : function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+'.tapSos';
					app.dh('Start','..',locMod);
					var store = Ext.getStore('localSosTicketStore');
					utils.showMyMasked(locale.getText('msgWaitPage'),false);
					me.getTicketBySOS("ticket.status='open'",true, function(records,operation,success){
						if (records.length>0) {
							var sosPage = Ext.create('mhelpdesk.view.SosPage');	
							me.pushPage(sosPage);
						}
						utils.hideMyMasked();
					});
				},
				tapVisitor : function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+'.tapVisitor';
					app.dh('Start','..',locMod);
					
					
					var sosPage = Ext.create('mhelpdesk.view.VisitorPage');	
					var page = sosPage;
					var mainPanel = page.down('#mainPanel');
					var aryButton = [];
					var isEditable = true;
					var isCallEnable = true;
					var buttonCls="r-mainguard-button";
					
					var localVisitorIconStore = Ext.getStore('localVisitorIconStore');
					localVisitorIconStore.load({
						scope: this,
						callback: function(records,operation,success) {
							for (var x = 0; x < records.length; x++) {
								try{
								var rec = records[x];
								console.error(rec.data.action);
								var rec = records[x];
								var tapAction = rec.data.action;
								console.error(tapAction);
								var tapButton=null;
								switch (tapAction) {
								case "tapBack" :
									tapButton = Ext.create('Ext.Button', {
										xtype: 'button',
										itemId: tapAction,
										disabled: !isEditable,
										showAnimation: 'popOut',
										cls: buttonCls,
										iconAlign: 'top',
										iconCls: rec.data.icon+' fa-2x',
										text : rec.data.title,
										listeners: {
											tap : function(thisButton, e, eOpts) {
												console.error('tap',thisButton.getItemId());
												page.fireEvent(thisButton.getItemId(), page, thisButton, e, eOpts);
											}
										}
									});
									aryButton.push(tapButton);	
									break;
								
								case "tapRegister":
								case "tapVisitorList" :
								case "tapVisitorPass" :
								case "tapDeliveryVehicle":
									if (isCallEnable) {
										tapButton = Ext.create('Ext.Button', {
											xtype: 'button',
											itemId: tapAction,
											disabled: !isEditable,
											showAnimation: 'popOut',
											cls: buttonCls,
											iconAlign: 'top',
											iconCls: rec.data.icon+' fa-2x',
											text : rec.data.title,
											listeners: {
												tap : function(thisButton, e, eOpts) {
													console.error('tap',thisButton.getItemId());
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
										text : rec.data.title,
										listeners: {
											tap : function(thisButton, e, eOpts) {
												console.error('tap',thisButton.getItemId());
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
							console.error('aryButton'+aryButton.length);
							for (var i = 0; i < aryButton.length; i++) {
								//console.error(breakLine);
								if (breakLine==1) {
									rowPanel = Ext.create('Ext.Panel',{
										layout : {
											type: 'hbox',
											pack: 'start',
											align: 'stretch'
//										},
//										defaults: {
//											cls: buttonCls
										}
									});
									aryRow.push(rowPanel);
								}
								rowPanel.add(aryButton[i]);
								breakLine++;
								if (breakLine>5) {
									breakLine=1;
									
								}
							}
							for (var i = 0; i < aryRow.length; i++) {
								mainPanel.add(aryRow[i]);
							}
						}
					});

					me.pushPage(sosPage);					
				},
				tapLogin: function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+'.tapVisitor';
					app.dh('Start','..',locMod);
					if (system.getIsLogin()) {
						me.doLogout();
					}else{
						var loginPage = Ext.create("mhelpdesk.view.Login");
						me.pushPage(loginPage);
					}
					
				}
			},
			
			menuhome : {
				showMe : function(thisMenu) {
					// console.error("XXXXXX");
					if (this._menuOpen) {
						Ext.Viewport.hideAllMenus();
						this._menuOpen = false;
					}
				}
			},
			navBar : {
				back : function() {
				    //history.back();  //pop the state to trigger listener in step 3
	    			//return false;  // return false so listener will take care of this

				}
			},
			main : {
				menuClick : function() {
					var locMod = "menuClick";
					var me = this;
					//console.error("SET Menu ");
					if (this._menuOpen) {
						Ext.Viewport.hideAllMenus();
						this._menuOpen = false;

					} else {
						this._menuOpen = true;
						// this._menuCurrent = "HOME";menuClick

						// console.log(me._menu);
						Ext.Viewport.setMenu(me._menu, {
									side : 'left',
									reveal : true
								});
						Ext.Viewport.toggleMenu("left");
					}
				},
				activeitemchange : function( thisPage, value, oldValue, eOpts ) {
					var me = this;
					var locMod = "main.activeitemchange";
					me.debugHandler(locMod,"info",locMod);
					try {
//						var navBar = thisPage.getNavigationBar();
//						console.error(thisPage.getTitle()+":"+navBar.getTitle());
//						if (navBar) {
//							
//							me.debugHandler(locMod,"warn","Set Title", thisPage.getTitle());
//							thisPage.setTitle(system.getTitle());
//							navBar.setTitle(system.getTitle());
//						}

					} catch (ex) {
						this.errHandler(ex, locMod);
					}

				},
//				activate : function( newActiveItem, thisPage, oldActiveItem, eOpts ){
//					var me = this;
//					var locMod = "main.activate";
//					me.debugHandler(locMod,"info",locMod);
//					try {
//						var navBar = thisPage.getNavigationBar();
//						console.error(thisPage.getTitle());
//						if (navBar && navBar.getTitle() != thisPage.getTitle()) {
//							me.debugHandler(locMod,"warn","Set Title", thisPage.getTitle());
//							navBar.setTitle(thisPage.getTitle());
//						}
//					} catch (ex) {
//						this.errHandler(ex, locMod);
//					}
//				},
				show : function(thisPage, eOpts) {
					var me = this;
					var locMod = "main.show";
					try {
						me.debugHandler(locMod, "info", "Show main screen ","...");
					} catch (ex) {
						this.errHandler(ex, locMod);
					}
				},
				push : function(thisPage, view, eOpts) {
					var me = this;
					var locMod = 'main-push';
					try {
						me._countNav = me._countNav + 1;
						
						me._currentPage = thisPage.getActiveItem();
						me.debugHandler(locMod,"info","NAV PUSH "+me._currentPage.getItemId(),me._countNav);
						
						if (me._backItem) {
							if (me._countNav > 1) {
								me.dh(locMod,'info','push',"enable backItem");
								me._backItem.setDisabled(false);
							}
						}
						me.refreshMainTitle(thisPage);
						
					} catch (ex) {
						me.errHandler(ex, locMod);

					}
				},
				pop : function(thisPage, view, eOpts) {
					
					var me = this;
					var locMod = "main-pop";
					try {
						me._countNav = me._countNav - 1;
						
						me._currentPage = thisPage.getActiveItem();
						var curPageID = thisPage.getActiveItem().getItemId();
						me.debugHandler(locMod,"info","NAV POP "+me._currentPage.getItemId()+":"+curPageID,me._countNav);
						
						if (me._countNav <= 1) {
							if (me._backItem) {
								me.dh(locMod,'info','pop',"disable backItem");
								me._backItem.setDisabled(true);
							}
						}
						me.refreshMainTitle(thisPage);
						
					} catch (ex) {
						me.errHandler(ex, locMod);
					}
				}//, 
//				back : function(thisNav, eOpts){
//					var me = this;
//					var locMod = "main-back";
//					try {
//						var navBar = thisNav.getNavigationBar();
//						//me._countNav = me._countNav - 1;
////						if (navBar) {
//							//navBar.down('#btnBack').setBadgeText(me._countNav);
////						}
////						if (me._countNav <= 1) {
////							me._countNav = 0;
////							
////							if (navBar) {
////								navBar.down('#btnBack').setHidden(true);
////							}
////							//console.error(navBar.down('#btnBack'))
////						}
//						
//						//console.log("NAV POP:" + me._countNav);
//						var curPageID = thisNav.getActiveItem().getItemId();
//						me.debugHandler(locMod,"info","NAV BACK "+me._currentPage.getItemId()+":"+curPageID,me._countNav);
//						
////						var curPage = thisNav.getActiveItem();
////						console.log("Page:" + curPage.getItemId());
//						
////						//console.log("Page:" + curPageID);
////						if (me._currentPage.getItemId() == curPageID) {
////							var prevItem = thisNav.getPreviousItem();
////							if (prevItem) {
////								console.error(prevItem.getItemId());
////								thisNav.setActiveItem(prevItem);
////							}
////						}
////						me._currentPage = thisNav.getActiveItem();
////						if (me._countNav <= 1) {
////							if (me._backItem) {
////								console.error("disable backItem");
////								me._backItem.setDisabled(true);
////							}
////						}
//						//var navBar = thisNav.getNavigationBar();
//						if (navBar && navBar.getTitle() != thisNav.getTitle()) {
//							me.debugHandler(locMod,"warn","Set Title", thisNav.getTitle());
//							navBar.setTitle(thisNav.getTitle());
//						}
//					} catch (ex) {
//						me.errHandler(ex, locMod);
//					}
//				}
			},
			homepage : {
				initialize : function() {
					//console.error("HomePage Initialize");
					var me = this;
					var homePage = me.getHomepage();
					var locMod = 'controller-homepageInitialize';
					
					me.dh(locMod,'debug',"Start","...");
					var carousel = Ext.create('Ext.Carousel', {	
						//cls : 'carousel',
						padding: 5,
						width : '100%',
						height : '100%',
						indicator : true,
						direction : 'horizontal',
						defaultType: 'panel'
					});
					
					
					var content = Ext.create('Ext.Panel', {
						itemId : 'pnlContent',
						layout : {
							type : 'vbox',
							pack : 'start',
							align : 'center'						
						},
						cls : 'r-main-content',
						width : '100%'
//						style : 'border-top: 1px solid rgba(0, 0, 0, 0.23) !important;padding-top: .5em;'
//						items : [{
//							cls: 'welcome-page',
//							html : "<div style='padding-left: 10px; padding-top: 20px;text-align: center;'>"
//									//+ "<img width='100px' height='50px' src='"+ system.getDefaultServer() +"images/logo-small-edc.png' />"
//									+ "<img width='80px' height='80px' src='data:image/png;base64,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' />"
//									+ "<div id='title'>"
//									+ me.txtWelcome
//									+ "</div>"
//									+ "</div>"
//									+ "<div id='subtitle'>" + me.txtIntro + "</div><br><br>"
//						}, {
//							xtype : 'panel',
//							cls : 'carousel',
//							items : [carousel]
//						}]
					});
					
					me.load_page(system.getCompanyId(), true, function(records,operation, success) {
						//console.error(records.length);
						if (records.length>0) {
							var record = records[0];
							var page_id = record.get("page_id");
							console.error("page id:"+page_id);
							var title = record.get("title_en");
							var desc = record.get("description_en");
							if (system.getLanguage()!="en") {
								
								title = record.get("title_ms_MY");
								desc = record.get("description_ms_MY");
							}
							//add content
//							content.add({
//								cls: 'welcome-page',
//								html : "<div style='padding-left: 10px; padding-top: 20px;text-align: center;'>"
//										+ "<img width='80px' height='90px' src='data:image/png;base64,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' />"
//										+ "<div id='title'>"
//										+ title
//										+ "</div>"
//										+ "</div>"
//										+ "<div id='subtitle'>" + desc + "</div><br><br>"
//							});
							carousel.add({
								cls: 'welcome-page',
								html : "<div style='padding-left: 10px; padding-top: 20px;text-align: center;'>"
										+ "<img width='80px' height='90px' src='data:image/png;base64,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' />"
										+ "<div id='title'>"
										+ title
										+ "</div>"
										+ "</div>"
										+ "<div id='subtitle'>" + desc + "</div><br><br>"
							});
							//add carousel
							me.load_pagedetail(page_id, false,function(records,operation, success) {
								if (records.length>0) {
									console.error(records);
									
									
									for (var i = 0; i < records.length; i++) {
										var recordD = records[i];
										var titleD = recordD.get("title_en");
										var descD = recordD.get("description_en");
										if (system.getLanguage()!="en") {
											
											titleD = recordD.get("title_ms_MY");
											descD = recordD.get("description_ms_MY");
										}
										carousel.add({
											title : 'Tab '+i,
											html : '<table width="100%" cellspacing="5px" border=0>'
													+ '<tr><td><span style="font-weight:bold;">'
													+ "<div id='subheader'>" + titleD + '</div>'
													+ '</span></td></tr>'
													+ '<tr><td>'
													+ descD
													+ '</td></tr>'
													+ '</table>'
										});
									}
									content.add(carousel);
//									content.add({
//										xtype : 'panel',
//										cls : 'carousel',
//										items : [carousel]
//									});
								}
								homePage.setItems([content]);
							});
							
						}
					});
				},
				scanQR : function(thePage, theButton, theDisplay) {
					var me = this;
					var locMod = 'controller-scanQR';
					try {

					} catch (ex) {
						me.errHandler(ex, locMod);
					}
				}
			},
			timetable : {
				dateChange : function(thisObject, newDate, oldDate, eOpts) {
					var me = this;
					try {
						//console.error("HERE");
						var dateSelected = me.getFormatDate(newDate);

						me.filter_store("localDailyTimetableStore", "fdate",
								dateSelected);
						me.debugHandler("timetable:dateChange", "info",
								dateSelected,
								me.count_store("localDailyTimetableStore"));
					} catch (ex) {
						me.eh(ex,'timetable');
					}
				}
			},
			search : {
				submit : function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var form = thisPage; // newnotification
					var fields = form.getValues();
					var key = fields['searchKey'];
					var value = fields['searchValue'];
					
					//console.error("Click"+key+":"+value);
					var searchStr = key + " LIKE '%"+value+"%'";
					me.search_client(searchStr,true);
				}
			},
			faqList : {
				onRefresh : function(thisPage, thisStore){
					var me = this;
					me.load_faq(true);
				}
			},
			occupantList: {
				onRefresh : function(page, thisStore){
					var me = this;
					var locMod = page.getItemId()+'.onItemDisclosure';
					app.dh('Start','...',locMod);
					me.load_all_client(true);
				},
				itemtap : function(thisList, index, target, record, e, eOpts) {
					var me = this;
					var locMod = "occupationList-itemtap";
					app.dh('Start','...',locMod);
					try{
						var tel = record.get("client_phone");
						if (!tel) record.get("client_mobile");
						if (tel) {
							if (me._deviceOS == "Android" || me._deviceOS == "iOS") {
								me.doCall(tel, 'Resident');
							}else{
								me.showMsgBoxOK(locale.getAlertText(),'Only applicable on mobile device!',Ext.MessageBox.ERROR,true);
							}
						}else{
							me.showMsgBoxOK(locale.getAlertText(),'No contact number availaible!',Ext.MessageBox.ERROR,true);
						}
					}catch(ex){
						me.errHandler(ex,locMod);	
					}
					
				},
				onItemDisclosure : function(page, record) {
					var me = this;
					var locMod = page.getItemId()+'.onItemDisclosure';
					//app.dh('Start','...',locMod);
				}
			},
			occupantPage: {
				search: function(thisPage, type, value, thisButton, e, eOpts){
					var me = this;
					var locMod = thisPage.getItemId()+'.search';
					app.dh('Start','...',locMod);	
					var filter;
					
				},
				onSearchKeyUp: function(thisPage,selection, thisSearch, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+'.onSearchKeyUp';
					//app.dh('Start','...',locMod);	
					
					queryString = thisSearch.getValue();
					  //console.log(this,'Please search by: ' + queryString);
					
					var store = Ext.getStore('localAllClientStore');
					store.clearFilter();
					
					if(queryString){
					   var thisRegEx = new RegExp(queryString, "i");
					   if (selection == 'name') {
						   store.filterBy(function(record) {
						    	if (thisRegEx.test(record.get('client_firstname')) || thisRegEx.test(record.get('client_lastname')) ) {
						     		return true;
						    	};
						    	return false;
						   });
					   }else{
					   		store.filterBy(function(record) {
						    	if (thisRegEx.test(record.get('asset_unit')) || thisRegEx.test(record.get('asset_name')) ) {
						     		return true;
						    	};
						    	return false;
						   });
					   }
					}
				},
				onClearSearch: function() {
				  	var me = this;
					var locMod = thisPage.getItemId()+'.onClearSearch';
					app.dh('Start','...',locMod);	
					
					var store = Ext.getStore('localAllClientStore');
					store.clearFilter();
				}
			},
			sosList : {
				itemtap : function(thisList, index, target, record, e, eOpts) {
					var me = this;
					var locMod = thisList.getItemId()+".itemtap";
					app.dh('Start','...',locMod);
					try{
						
						utils.showMyMasked(locale.getText('msgWaitPage'),false);
					
						me.getTicketById(record.data.ticket_id,true,
							function(records,operation,success){
								var record = records[0];
								var ticketId;
								if (record) ticketId = record.data.ticket_id;
								var page = Ext.create('mhelpdesk.view.ticket.SosAction',{
									ticketId : ticketId
								});
								me.pushPage(page);
								if (records.length>0) {
									page.setRecord(records[0]);
								}
								utils.hideMyMasked();
							}
						);
						
					}catch(ex){
						me.errHandler(ex,locMod);	
						utils.hideMyMasked();
					}
					
				}//,
//				onItemDisclosure : function(page, record) {
//					var me = this;
//					var locMod = page.getItemId()+'.onItemDisclosure';
//					app.dh('Start','...',locMod);
//				}
			},
			visitorList : {
				itemtap : function(thisList, index, target, record, e, eOpts) {
					var me = this;
					var locMod = thisList.getItemId()+".itemtap";
					app.dh('Start','...',locMod);
					try{
						var ticket_id = record.data.ticket_id;
						var topic_id = record.data.topic_id;
						var page;
						console.error(topic_id);
						if (topic_id==5) {
							page = Ext.create('mhelpdesk.view.visitor.ViewDelivery',{
								ticketId:ticket_id
							});
						}else{	
							page = Ext.create('mhelpdesk.view.visitor.ViewVisitor',{
								ticketId:ticket_id
							});
						}
							
						
						utils.showMyMasked(locale.getText('msgWaitPage'),false);
						me.getTicketMessage(ticket_id, true, function(records,operation,success){
							
							me.pushPage(page);
							if (records.length>0) {
								page.down('#asset_unit').setValue(record.data.asset_unit);
								page.setRecord(records[0]);
							}
							utils.hideMyMasked();
						});
						
						
					}catch(ex){
						app.eh(ex,locMod);	
						utils.hideMyMasked();
					}
					
				}
			},
			messageList : {
				back : function(thisPage) {
					var me = this;
					me.popPage();
				},
				onRefresh : function(thisPage, store) {
					var me = this;
					store.load({
						scope: me,
						callback: function(records, operations, success) {
								if (records.length>0) {
									var record = records[0];
									var ticket_id = record.get('ticket_id');
									me.getTicketMessage(ticket_id, true);
								}
						}
					});
				}
			},
			postMessage : {
				swipeBack : function(thisPage) {
					var me = this;
					me.popPage();
				},
				postReply : function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = "postMessage-postReply";
					me.debugHandler(locMod,"info",locMod);
					try{
						var form = thisPage; 
						var fields = form.getValues();
						var isValid = true;
						var errors = new Array();
						var errLabel = thisPage.down('#errorMessage');
						
						var ticket_id = fields['id'];
						var btn = thisPage.down('#fileBtn');
						if (fields['message'] == "") {
							isValid = false;
							errors.push({
								field : locale.getText('Message'),
								reason : locale.getText("fieldEmpty")
							});
						}
						if (isValid) {
							me.showMyMasked(locale.getText('waitProcess'),false);
							doSubmit(0, 3000);
						}else{
							var errStr="";
							Ext.each(errors, function(error, index) {
								errStr += "[" + (index + 1) + "] - " + error.field + " "
										+ error.reason + "<br>";
							});							
							me.displayError(errLabel,errStr, true);
						}
						function doSubmit(start, timeout) {
							var flag = false;
							var msg = locale.getText("msgTransFail");
	
							Ext.Ajax.request({
								useDefaultXhrHeader : false,
								timeout : 5000,
								scope : me,
								url : system.getDefaultServer() + 'mpost.php',
								method : 'post',
								params : {
									ticket_id : ticket_id,
									id : ticket_id,
									message : fields['message']
								},
								success : function(response) {
									console.error("REPLY SUCCESS");		
									//console.error(response);
									try {
										if (response) {
											var dataResponse = me.getJSON(response.responseText);
											console.error(dataResponse);
											if (dataResponse) {
												msg = dataResponse.message;
												if (dataResponse.success) {
													btn.setRefid(dataResponse.msgid);
													flag = true;
													me.dh(locMod,'debug',"Send Action Reply",ticket_id);
													Ext.Ajax.request({
														useDefaultXhrHeader : false,
														timeout : timeout,
														scope : me,
														method: 'POST',
														url : system.getDefaultServer() + 'mactionreply.php',
														method : 'post',
														params : {
															ticket_id : ticket_id
														},
														success : function(response) {	
															//console.log("XXXX");
															//console.error(response);
															//if (response) {
															//var dataResponse = me.getJSON(response.responseText);
														},
														failure : function(response) {
															//console.log("XXXX");
															//console.error(response);
															me.eh("Ticket Alert Fail",locMod);
														}
													});
												}
											}
										}
									}catch(ex){
										msg = ex;
									}
									doProcess(flag,msg);
								},
								failure : function(response) {
									
									if (start==0) { 
										console.error("Try AGAIN");
										doSubmit(1, 10000); 
										return; 
									}
									if (response) {
										var dataResponse = me.getJSON(response.responseText);
										if (dataResponse) {
											msg = response.responseText;
										}
									}
									console.error("REPLY FAIL "+msg);
									doProcess(false, msg);				
									
//									console.error(response);
//									if (response) {
//										var dataResponse = me.getJSON(response.responseText);
//										if (dataResponse) {
//											msg = dataResponse.message;
//										}
//									}
//									doProcess(false,msg);					
								}
							});
						}
						function doProcess(flag, msg) {
							me.hideMyMasked();
							if (flag) {
								if (btn.isStateReady()) {								
									btn.setTicketid(ticket_id);
									btn.doPost();
								}
								me.getTicketMessage(ticket_id, true, function(records, opreation, success){
									me.sendAndroidNotification2User(system.getUser(),locale.getText("msgThanks"), locale.getText('msgReply')+' '+ locale.getText('msgCreated'));
								
								});
								me.popPage();								
							}else{
								me.errHandler(msg,locMod);	
								me.displayError(errLabel,msg, true);
							}
						}
					}catch(ex){
						me.errHandler(ex, locMod);	
					}
				},
				postCancel : function(thisPage, thisButton, e, eOpts) {
					var me = this;
					
				}
			},
			viewTicket : {
				back : function(thisPage) {
					var me = this;
					me.popPage();
				},
				postReply : function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = "";
					me.debugHandler(locMod,"info",locMod);
					try{
						var page = Ext.create('mhelpdesk.view.PostMessage');
						var form = thisPage; // newnotification
						var fields = form.getValues();
						var id = fields['ticket_id'];
						
						me.pushPage(page);
						page.down('#id').setValue(id);
					}catch(ex){
						me.errHandler(ex, locMod);	
					}
				}
			},
			viewVisitor : {
				close: function(thisPage, thisButton, e, eOpts) {
					this.popPage();	
				},
				save : function( thisPage, ticket_id, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+".save";
					app.dh('Start','...',locMod);
					try{	
						utils.showMyMasked(locale.getText('waitProcess'),false);
						Ext.Ajax.request({
							url : system.getDefaultServer() + 'remote/oper_ticket.php',
							method : 'post',
							params : {
								id : ticket_id,
								mode: 'CLOSED'
							},
							success : function(response) {
								console.error(response);
								utils.hideMyMasked();
		                		var dataResponse = me.getJSON(response.responseText);
		                		var success=0;
								try{
									console.error(dataResponse.data);
									if (dataResponse){
										success = dataResponse.success;
									}
		                			console.error(success);
									if (success==1) {
										me.getTicketByVisitor("ticket.status='open'",true, function(records,operation,success){
											utils.showMsgBoxOK(locale.getSuccessText(), locale.getText('msgUpdSuccess'), Ext.MessageBox.INFO);	
											me.popPage();
										});
										
																		
									}else{
										utils.showMsgBoxOK(locale.getFailText(), locale.getText('msgTransFail'), Ext.MessageBox.ERROR);	
									}
								}catch(ex){
									app.eh(ex,locMod);
									utils.hideMyMasked();
								}
							},
							failure : function(response) {
								utils.showMsgBoxOK(locale.getFailText(), locale.getText('msgTransFail'), Ext.MessageBox.ERROR);	
								utils.hideMyMasked();
							}
						});
						
					}catch(ex){
						app.eh(ex,locMod);
						utils.hideMyMasked();
					}	
				}
			},
			viewDelivery : {
				close: function(thisPage, thisButton, e, eOpts) {
					this.popPage();	
				},
				save : function( thisPage, ticket_id, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId()+".save";
					app.dh('Start','...',locMod);
					try{	
						utils.showMyMasked(locale.getText('waitProcess'),false);
						Ext.Ajax.request({
							url : system.getDefaultServer() + 'remote/oper_ticket.php',
							method : 'post',
							params : {
								id : ticket_id,
								mode: 'CLOSED'
							},
							success : function(response) {
								console.error(response);
								utils.hideMyMasked();
		                		var dataResponse = me.getJSON(response.responseText);
		                		var success=0;
								try{
									console.error(dataResponse.data);
									if (dataResponse){
										success = dataResponse.success;
									}
		                			console.error(success);
									if (success==1) {
										me.getTicketByVisitor("ticket.status='open'",true, function(records,operation,success){
											utils.showMsgBoxOK(locale.getSuccessText(), locale.getText('msgUpdSuccess'), Ext.MessageBox.INFO);	
											me.popPage();
										});
										
																		
									}else{
										utils.showMsgBoxOK(locale.getFailText(), locale.getText('msgTransFail'), Ext.MessageBox.ERROR);	
									}
								}catch(ex){
									app.eh(ex,locMod);
									utils.hideMyMasked();
								}
							},
							failure : function(response) {
								utils.showMsgBoxOK(locale.getFailText(), locale.getText('msgTransFail'), Ext.MessageBox.ERROR);	
								utils.hideMyMasked();
							}
						});
						
					}catch(ex){
						app.eh(ex,locMod);
						utils.hideMyMasked();
					}	
				}
			},
			noticeTicket : {
				back : function(thisPage){
					this.popPage();	
				}
				
			},
			noticeTicketFail : {
				back : function(thisPage){
					this.popPage();	
				}
			},
			ticket : {
				initialize: function() {
					var me = this;
					var ticketForm = me.getTicket();
					var locMod = "controller.ticket.initialize";
					me.dh(locMod,'debug','Start','...');
					if (system.getIsLogin()) {
						me.load_client(system.getLastId(), false,
							function(records,operation,success) {
								//console.error(records.length);	
								
								if (success && records.length>0) {
									var record = records[0];
									var client_id = record.get('client_id');
									ticketForm.down('#name').setValue(record.get('client_firstname')+" "+record.get('client_lastname'));
									ticketForm.down('#email').setValue(record.get('client_email'));
									var phone = record.get('client_phone');
									if (!phone) {
										phone = record.get('client_mobile');	
									}
									ticketForm.down('#phone').setValue(phone);
									
									me.load_product(client_id, true, function(recordsProduct,operation, success) {
										//console.error("load product done "+recordsProduct.length);
										//console.error(recordsProduct);
										if (recordsProduct.length > 0) {
											var recordProduct = recordsProduct[0];
											//console.error("Asset Default " + recordProduct.get('asset_id'));
											ticketForm.down('#asset_id').setValue(recordProduct.get('asset_id'));
										}else{	
											me.showMsgBoxOK(locale.getAlertText(),'You do NOT have unit no associate to you, please ask management',
												Ext.MessageBox.ERROR,false);
											me.clearStore(me._localProductStore);	
										}
									});
								}
								
						});
					}
					
				},
				captcha : function(form) {
					var me = this;
					//var form = me.getTicket();
					me.dh('ticket-captcha','info','Start','...'+me._deviceOS);
					//console.log(form);
					var imgCaptchaLabel = form.down('#imgCaptcha');
					var captchaValue = form.down('#captchaValue');
					var pnlCaptcha = form.down('#pnlCaptcha');
					var pnlAttachment = form.down('#pnlAttachment');
					var fileBtnTicket = form.down('#fileBtnTicket');
					
					var localConfigStore = Ext.getStore('localConfigStore');
					localConfigStore.load({
						scope: me,
						callback: function(records,operation,success) {
							var isCaptcha=false;
							var isAttachment=false;
							pnlCaptcha.hide();
							pnlAttachment.hide();
							fileBtnTicket.hide();
							if (records.length>0) {
								var record= records[0];
								if (record) {
									console.error('record.data.enable_captcha:'+record.data.enable_captcha);
									if (record.data.enable_captcha==1) isCaptcha=true;	
									if (record.data.allow_online_attachments==1) isAttachment=true;
								}
							}
							if (isCaptcha) {
								
								var text = getTxtCaptcha();
								var img = getImgCaptcha();
								//console.log(text+" "+img);
								var imgPath = "";
								if (me._deviceOS == "Android") {
									imgPath = 'file:///android_asset/www/images/captcha/'+img;
								} else if (me._deviceOS == "iOS") {
									imgPath = 'file:///images/captcha/'+img;
								} else {
									imgPath = 'url(../images/captcha/'+img+')';
								}
								var style = 'background: '+ imgPath +' !important;';
								var styleText = '<div style="'+style+' border: 1px solid black;width: 100px;min-height: 1.8em;text-align:center;">'+text+'</div>';
								
								//console.error(style);
								if (imgCaptchaLabel) {
									imgCaptchaLabel.setHtml(styleText);
									//imgCaptchaLabel.setStyleHtmlCls(style);
									
									if (captchaValue) { captchaValue.setValue(text); }
								}
								pnlCaptcha.show();
							}
							if (isAttachment) {
								pnlAttachment.show();	
								fileBtnTicket.show();
							}
						}
						
					});
					
					

					function getTxtCaptcha(){
					    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
						var text = "";
					
					    for( var i=0; i < 5; i++ )
					        text += possible.charAt(Math.floor(Math.random() * possible.length));
					        
					    return text;    
					}
					function getImgCaptcha(){
						var img = "";
						var imgIndex = Math.ceil(Math.random() * 9);
						switch (imgIndex) {
						  case 0:
						    img = "bubbles.png";
						    break;
						  case 1:
						    img = "cottoncandy.png";
						    break;
						  case 2:
						    img = "crackle.png";
						    break;
						  case 3:
						    img = "grass.png";
						    break;
						  case 4:
						    img = "lines.png";
						    break;
						  case 5:
						    img = "ripple.png";
						    break;
						  case 6:
						    img = "sand.png";
						    break;
						  case 7:
						    img = "silk.png";
						    break;
						  case 8:
						    img = "snakeskin.png";
						    break;  
			    		  default:
						    img = "whirlpool.png";
						}
						return img;
					}
				},
				submit : function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = "ticket-submit";
					me.dh(locMod,'info','Start','...');
					try {
						var form = thisPage; 
						var fields = form.getValues();
						var isValid = true;
						var errors = new Array();
						var errLabel = thisPage.down('#errorMessage');
						var recordConfig = me._localConfigStore.getAt(0);
						
						if (fields['name'] == "") {
							isValid = false;
							errors.push({
								field : thisPage.down('#name').getLabel(),
								reason : locale.getText("fieldEmpty")
							});
						}
						if (fields['email'] == "") {
							isValid = false;
							errors.push({
								field : thisPage.down('#email').getLabel(),
								reason : locale.getText("fieldEmpty")
							});
						}
						if (fields['phone'] == "") {
							isValid = false;
							errors.push({
								field : thisPage.down('#phone').getLabel(),
								reason : locale.getText("fieldEmpty")
							});
						}
						if (fields['subject'] == "") {
							isValid = false;
							errors.push({
								field : thisPage.down('#subject').getLabel(),
								reason : locale.getText("fieldEmpty")
							});
						}
						if (fields['message'] == "") {
							isValid = false;
							errors.push({
								field : thisPage.down('#message').getLabel(),
								reason : locale.getText("fieldEmpty")
							});
						}
						
						if (recordConfig.get('enable_captcha')==1){
							if (fields['captcha'] == "") {
								isValid = false;
								errors.push({
									field : thisPage.down('#labelCaptcha').getHtml(),
									reason : locale.getText("fieldEmpty")
								});
							}else{
								if (fields['captcha'] != fields['captchaValue']) {
									isValid = false;
									errors.push({
										field : thisPage.down('#labelCaptcha').getHtml(),
										reason : locale.getText("fieldDifferent")
									});
								}
							}
						}
						var btn = thisPage.down('#fileBtnTicket');
						var flag = false;
						var msg = locale.getText('msgNoticeFail');
									
						if (isValid) {
							me.showMyMasked(locale.getText('waitProcess'),false);
							doSubmit(0, 3000);
						}else{
							var errStr="";
							Ext.each(errors, function(error, index) {
								errStr += "[" + (index + 1) + "] - " + error.field + " "
										+ error.reason + "<br>";
							});							
							me.displayError(errLabel,errStr, true);
							me.handleFormError(errors);
						}
						function doSubmit(start, timeout) {
							var params = Ext.util.JSON.encode(form.getValues());
							Ext.Ajax.request({
								useDefaultXhrHeader : false,
								timeout : timeout,
								scope : me,
								method: 'POST',
								url : system.getDefaultServer() + 'mopen.php',
								method : 'post',
								//params : params,
								params : {
									company_id : fields['company_id'],
									client_id : fields['client_id'],
									name : fields['name'],
									email : fields['email'],
									phone : fields['phone'],
									asset_id : fields['asset_id'],
									topic_id : fields['topic_id'],
									topicId : fields['topicId'],
									subject : fields['subject'],
									message : fields['message'],
									pri : fields['pri']
									
								},
								success : function(response) {	
									var ticketID = "";
									var ticket_id = null;
									try {
										if (response) {
											var dataResponse = me.getJSON(response.responseText);
											if (dataResponse) {
												msg = dataResponse.message;
												if (dataResponse.success) {
													//getRefid
													ticket_id = dataResponse.ticket_id;
													btn.setRefid(dataResponse.msgid);
													btn.setTicketid(ticket_id);
													ticketID = dataResponse.ticketID;
													flag = true;
													me.dh(locMod,'debug',"Send Action Ticket",ticket_id);
													Ext.Ajax.request({
														useDefaultXhrHeader : false,
														timeout : timeout,
														scope : me,
														method: 'POST',
														url : system.getDefaultServer() + 'maction.php',
														method : 'post',
														params : {
															ticket_id : ticket_id,
															company_id : fields['company_id'],
															client_id : fields['client_id'],
															name : fields['name'],
															email : fields['email'],
															phone : fields['phone'],
															asset_id : fields['asset_id'],
															topic_id : fields['topic_id'],
															topicId : fields['topicId'],
															subject : fields['subject'],
															message : fields['message'],
															pri : fields['pri']
															
														},
														success : function(response) {	
															//console.log("XXXX");
															//console.error(response);
															//if (response) {
															//var dataResponse = me.getJSON(response.responseText);
														},
														failure : function(response) {
															//console.log("XXXX");
															//console.error(response);
															me.eh("Ticket Alert Fail",locMod);
														}
													});
												}
											}
										}										
									}catch(ex) {
										msg = ex;
									}
									doProcess(flag,msg,ticketID);
								},
								failure : function(response) {
									//console.error(response);
									if (start==0) { 
										doSubmit(1, 10000); 
										return; 
									}
									if (response) {
										var dataResponse = me.getJSON(response.responseText);
										if (dataResponse) {
											msg = response.responseText;
										}
									}
									doProcess(false, msg);									
								}
							});
						}
						function doProcess(flag, msg, ticketID) {
							var page;
							me.hideMyMasked();
							if (flag) {
								me.debugHandler(locMod,"log",msg);
								if (btn.isStateReady()) {	
									me.dh(locMod,'info','upload Image',"...");
									btn.setTicketid(ticketID);
									btn.doPost();
								}
								page = Ext.create('mhelpdesk.view.NoticeTicket',{
									user: fields['name'],
									email: fields['email'],		
									ticketID : ticketID
								});
								me.pushPage(page);
								
								me.sendAndroidUserTag(fields['email'],"CLIENT");
								me.sendAndroidNotification2Segment("STAFF", fields['subject'], fields['message']);
								me.sendAndroidNotification2User(system.getUser(),locale.getText("msgThanks"), locale.getText('Ticket')+' ('+ticketID+') '+ locale.getText('msgCreated'));
								form.reset();
								var ticketForm = me.getTicket();
								if (system.getIsLogin()) {
									me.load_client(system.getLastId(), false,
										function(records,operation,success) {
											if (success && records.length>0) {
												var record = records[0];
												var client_id = record.get('client_id');
												ticketForm.down('#name').setValue(record.get('client_firstname')+" "+record.get('client_lastname'));
												ticketForm.down('#email').setValue(record.get('client_email'));
												var phone = record.get('client_phone');
												if (!phone) {
													phone = record.get('client_mobile');	
												}
												ticketForm.down('#phone').setValue(phone);
												
												me.load_product(client_id, true, function(recordsProduct,operation, success) {
													if (recordsProduct.length > 0) {
														var recordProduct = recordsProduct[0];
														ticketForm.down('#asset_id').setValue(recordProduct.get('asset_id'));
													}else{	
														me.showMsgBoxOK(locale.getAlertText(),'You do NOT have unit no associate to you, please ask management',
															Ext.MessageBox.ERROR,false);
														me.clearStore(me._localProductStore);	
													}
												});
											}
											
									});
								}
								me.getTicketByClient(system.getLastId(),true);
							}else{
								me.errHandler(msg,locMod);	
								page = Ext.create('mhelpdesk.view.NoticeTicketFail',{
									user: fields['name'],
									email: fields['email'],
									msg: msg
								
								});
								me.pushPage(page);
							}							
						}
					}catch(ex){
						me.hideMyMasked();
						me.errHandler(ex,locMod);
						
					}
				}
			},
			ticketList : {
				itemtap : function(thisList, index, target, record, e, eOpts) {
					var me = this;
					var locMod = "ticketList-itemtap";
					me.debugHandler(locMod,"info",locMod);
					try{
						//var userTicket = me.getUserTicket();
						//userTicket.down("#btnView").setDisabled(false);
						me._tickectId = record.get('ticketID');
						me._currentTicket = record;
					}catch(ex){
						me.errHandler(ex,locMod);	
					}
					
				},
				itemdoubletap : function(thisList, index, target, record, e, eOpts) {
					var me = this;
					var locMod = "ticketList-itemdoubletap";
					me.debugHandler(locMod,"info",locMod);
					try{
						me.openUserTicket(record);
					}catch(ex){
						me.errHandler(ex,locMod);	
					}
							
				},
				onRefresh : function(thisPage, store){					
					var me = this;
					var locMod = "ticketList-onRefresh";		
					me.dh(locMod,'debug','Start',system.getLastId());
					try{
						if (system.getLastId()) {
							//me.debugHandler(locMod,"info","Check ticket for "+me._email);
							me.showMyMasked(locale.getText('waitProcess'),false);
							me.getTicketByClient(system.getLastId(),true,function(records, operation, success){
								me.hideMyMasked();
							});
							
//							me.getTicketById(me._id, function(records, operation, success){
//								me.hideMyMasked();
//							});
						}
					}catch(ex){
						me.errHandler(ex,locMod);	
					}
				}
			},
			notification : {
				onRefresh : function(thisPage, store){					
					var me = this;
					var locMod = "notification-onRefresh";		
					me.dh(locMod,'debug','Start',"..");
					try{
						if (system.getLastId()) {
							//me.debugHandler(locMod,"info","Check ticket for "+me._email);
							me.showMyMasked(locale.getText('waitProcess'),false);
							me.load_notification(true,function(records, operation, success){
								me.hideMyMasked();
							});
							
//							me.getTicketById(me._id, function(records, operation, success){
//								me.hideMyMasked();
//							});
						}
					}catch(ex){
						me.errHandler(ex,locMod);	
					}
				}
			},
			event : {
				onRefresh : function(thisPage, store){					
					var me = this;
					var locMod = "event-onRefresh";		
					me.dh(locMod,'debug','Start',"..");
					try{
						if (system.getLastId()) {
							//me.debugHandler(locMod,"info","Check ticket for "+me._email);
							me.showMyMasked(locale.getText('waitProcess'),false);
							me.load_event(true,function(records, operation, success){
								me.hideMyMasked();
							});
							
//							me.getTicketById(me._id, function(records, operation, success){
//								me.hideMyMasked();
//							});
						}
					}catch(ex){
						me.errHandler(ex,locMod);	
					}
				}
			},
			userTicket : {
				swipeBack : function(thisPage) {
					var me = this;
					me.popPage();
				},
				viewTicket : function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = "userTicket-viewTicket";
					me.debugHandler(locMod,"info",locMod);
					try{
						var record = me._currentTicket;
						me.openUserTicket(record);
					}catch(ex){
						me.errHandler(ex,locMod);	
					}
				}
			},
			status : {
				viewTicket : function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = "viewTicket";
					me.debugHandler(locMod,"info",locMod);
					try{
						var isValid = true;
						var errors = new Array();
						var form = thisPage; // newnotification
						var errLabel = thisPage.down('#errorMessage');
						var fields = form.getValues();
						if (fields['lemail'] == "") {
							isValid = false;
							errors.push({
								field : 'Email',
								reason : locale.getText("fieldEmpty")
							});
						}
						if (fields['lticket'] == "") {
							isValid = false;
							errors.push({
								field : 'Ticket',
								reason : locale.getText("fieldEmpty")
							});
						}
						if (isValid) {
							me.showMyMasked(locale.getText('waitProcess'),false);
							var flag = false;
							var msg = locale.getText('msgNoticeFail');
									
							Ext.Ajax.request({
								useDefaultXhrHeader : false,
								//timeout : 5000,
								scope : me,
								url : system.getDefaultServer() + 'mlogin.php',
								method : 'post',
								params : {
									lemail : fields['lemail'],
									lticket : fields['lticket']
								},
								success : function(response) {
									if (response) {
										var dataResponse = me.getJSON(response.responseText);
										if (dataResponse) {
											msg = dataResponse.message;
											if (dataResponse.success) {
												me._email = dataResponse.email;
												me._id = dataResponse.id;
												me._ticketId = dataResponse.ticketId;
												//console.error(me._id);
												me.getTicketById(me._id, true);
												//me.getTicketByEmail(me._email);
												flag = true;
											}
										}
									}
									doProcess(flag,msg);
								},
								failure : function(response) {
									
									if (response) {
										//console.error(response);
										var dataResponse = me.getJSON(response.responseText);
										if (dataResponse) {
											msg = response.responseText;
										}
									}
									doProcess(false,msg);								
								}
							});
						}else{
							var errStr="";
							Ext.each(errors, function(error, index) {
								errStr += "[" + (index + 1) + "] - " + error.field + " "
										+ error.reason + "<br>";
							});	
							doProcess(false, errStr);	
						}
						function doProcess(flag,msg) {
							me.hideMyMasked();

							if (flag) {
								var page = Ext.create("mhelpdesk.view.UserTicket");
								me.pushPage(page);
								me.sendAndroidUserTag(fields['lemail'],"CLIENT");
							}else{
								me.errHandler(msg,locMod);									
								me.displayError(errLabel, msg, true);
							}
						}
					}catch(ex){
						me.hideMyMasked();
						me.errHandler(ex, locMod);	
					}
				},
				createTicket : function() {
					var me = this;
					var locMod = "createTicket";
					me.debugHandler(locMod,"info",locMod);
					try{
						var mainpage = me.getMainPage2();
						var page = Ext.create('mhelpdesk.view.Ticket');
						me.pushPage(page);
						
						//var tabTicket = mainpage.down('#tabTicket');
						//mainpage.setActiveItem(tabTicket);
					}catch(ex){
						me.errHandler(ex, locMod);	
					}
					
				}
			},
			timetableNew : {
				scanSubject : function(thisPage, thisButton, thisDisplay, e,
						eOpts) {
					var me = this;
					var locMod = '';
					try {
						//console.error("scan click");
						if (me._deviceOS == "Android" || me._deviceOS == "iOS") {
							cordova.plugins.barcodeScanner.scan(
									function(result) {
										thisDisplay.setValue(result.text);
									}, function(error) {
										// alert("Scanning failed: " + error);
										me.showMsgBoxOK(locale
														.getText('msgAlert'),
												error, Ext.MessageBox.ERROR,
												false);
									});
						} else {
							console.log("not available");
						}
					} catch (ex) {
						me.errHandler(ex, locMod);
					}
				},
				save : function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId() + "-save";
					var isValid = true;
					var errors = new Array();
					me.debugHandler(locMod, "info", "save daily time table");
					try {
						//console.error(thisPage.getMODE());
						var form = thisPage; // newnotification
						var fields = form.getValues();
						if (fields['code'] == "") {
							isValid = false;
							errors.push({
								field : 'code',
								reason : locale.getText("fieldEmpty")
							});
						}
						if (fields['subject'] == "") {
							isValid = false;
							errors.push({
								field : 'subject',
								reason : locale.getText("fieldEmpty")
							});
						}
						
						if (fields['fdate'] == "") {
							isValid = false;
							errors.push({
								field : 'fdate',
								reason : locale.getText("fieldEmpty")
							});
						}else{
							var fdate = me.getFormatDate(fields['fdate']);
							if (fdate.search("-") == -1) {
								isValid = false;
								errors.push({
									field : 'fdate',
									reason : locale.getText("dateInvalid")
								});
							}else{
								var dt = me.getSysDate(fdate);
								if (!dt) {
									isValid = false;
									errors.push({
										field : 'fdate',
										reason : locale.getText("dateInvalid")
									});
								}
							}
						}
						if (fields['stime'] == "") {
							isValid = false;
							errors.push({
								field : 'stime',
								reason : locale.getText("fieldEmpty")
							});
						}else{
							if (fields['stime'].search(":") == -1) {
								isValid = false;
								errors.push({
									field : 'stime',
									reason : locale.getText("timeInvalid")
								});
							}
						}
						if (fields['etime'] == "") {
							isValid = false;
							errors.push({
								field : 'etime',
								reason : locale.getText("fieldEmpty")
							});
						}else{
							if (fields['etime'].search(":") == -1) {
								isValid = false;
								errors.push({
									field : 'etime',
									reason : locale.getText("timeInvalid")
								});
							}
						}
						if (fields['duration'] == "" || fields['duration']==null) {
							isValid = false;
							errors.push({
								field : 'duration',
								reason : locale.getText("fieldEmpty")
							});
						}
						
						if (isValid) {
							if (thisPage.getMODE()=="EDIT") {
								me.remove_dailytimetable(thisPage);
							}
							if (me.save_dailytimetable(thisPage)) {
								me.showToast(locale.getText("msgAddSuccess"), 3);
								// me.showMsgBoxOK(locale.getSuccessText(), locale
								// .getText("msgAddSuccess"),
								// Ext.MessageBox.INFO, true)
								me.popPage();
							} else {
								me.showMsgBoxOK(locale.getSuccessText(), locale
												.getText("msgTransFail"),
										Ext.MessageBox.ERROR, true)
							}
						}else{
							me.handleFormError(errors);
						}
					} catch (ex) {
						me.errHandler(ex, locMod);
					}

				},
				remove_subject : function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId() + "-save";
					me.debugHandler(locMod, "info", "delete daily time table");
					try {
						if (me.remove_dailytimetable(thisPage)) {
							me.showToast(locale.getText("msgDelSuccess"), 3);
							// me.showMsgBoxOK(locale.getSuccessText(), locale
							// .getText("msgDelSuccess"),
							// Ext.MessageBox.INFO, true)
							me.popPage();
						} else {
							me.showMsgBoxOK(locale.getSuccessText(), locale
											.getText("msgTransFail"),
									Ext.MessageBox.ERROR, true);
						}
					} catch (ex) {
						me.errHandler(ex, locMod);
					}
				},
				cancel : function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId() + "-cancel";
					try {
						me.popPage();
					} catch (ex) {
						me.errHandler(ex, locMod);
					}
				},
				info : function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId() + "-info";
					try {
						me.doHelp(thisPage);
					} catch (ex) {
						me.errHandler(ex, locMod);
					}
				}
			},
			timetableList : {
				itemtap : function(thisList, index, target, record, e, eOpts) {

					var me = this;
					me._curRecord = record;

					var page = Ext.create('mhelpdesk.view.TimetableNew');

					
					page.setRecord(me._curRecord);
					me.pushPage(page);
					page.setMODE("EDIT");
					var fdate = page.down('#fdate');
					try{
						var dt = me.getSysDate(record.get('fdate'));
						fdate.setValue(dt);
					}catch(e){
						me.errHandler(e,"timetableList-itemtap");
					}
					
				}
			},
			systemConfig : {
				save : function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = thisPage.getItemId() + "-save";
					me.debugHandler(locMod, "info", "save daily time table");
					try {
						if (me.save_systemconfig(thisPage)) {
							//console.error("DONE HERE:"+locale);
							me.showMsgBoxOK(locale.getSuccessText(), locale
											.getText("msgAddSuccess"),
									Ext.MessageBox.INFO, true);
							me.showMyMasked(locale.getText('msgWaitPage'),
									false);
							me.doDelay(5000, function() {
										// mainPage.setMasked(false);
										window.location.reload();
									});
						} else {
							me.showMsgBoxOK(locale.getSuccessText(), locale
											.getText("msgTransFail"),
									Ext.MessageBox.ERROR, true);
						}
					} catch (ex) {
						me.errHandler(ex, locMod);
					}
				},
				soundChange : function(systemConfigPage, slider, newValue,
						oldValue, eOpts) {
					var me = this;
					var locMod = "sysConfig";
					try {
						if (oldValue == 0 && newValue == 1) {
							me._onSound = true;
						} else if (oldValue == 1 && newValue == 0) {
							me._onSound = false;

						}
						me.updSysSetting('sound', newValue);
						system.setSound(me._onSound);
						// console.log(me._localSystemSettingStore);
					} catch (ex) {
						me.errHandler(ex, locMod);
					}
				}
			},
			fileUpload : {
				openCamera1 : 'getPhoto',
				resetPicture : function(){
					var me = this;
					var locMod = 'fileUpload-resetPicture';
					try{
						//console.error("reset");
						var localStore = Ext.getStore('localLoadedImageStore');
						localStore.removeAll(false);
						localStore.sync();
						me.showMyMasked(locale.getText('msgWaitPage'),
									false);
						me.doDelay(5000, function() {
									// mainPage.setMasked(false);
									window.location.reload();
								});
					}catch(ex){
						me.errHandler(ex,locMod);
					}
				},
				setPicture : function() {
					var me = this;
					var locMod = 'fileUpload-resetPicture';
					try{
						//console.error("set");
						me.showMyMasked(locale.getText('msgWaitPage'),
									false);
						me.doDelay(5000, function() {
									// mainPage.setMasked(false);
									window.location.reload();
								});
					}catch(ex){
						me.errHandler(ex,locMod);
					}
				}
			},
			fileBtn : {
				success : function(path){
					var locMod = "onFileUploadSchoolImgSuccess";
					var me = this;
					me.dh(locMod,'info','fileBtn-upload Success',path);
					//console.error("success"+path);
					//me.uploadSetPath(me.getSchoolImgPath(), me.getLoadedImageImg(), path);
				},
				failure : function(message, response) {
					var locMod = "onFileUploadSchoolImgFailure";
					me.dh(locMod,'error','fileBtn-upload Success',message);
					//console.error("fail");
					//this.uploadPathFail(locMod, message);
				}
			},
			fileBtnPostMessage : {
				success : function(path, response){
					//console.error(response);
				},
				failure : function(message, response) {
					var locMod = "fileBtnPostMessage-Error";
					//console.error("fail");
					//this.uploadPathFail(locMod, message);
				},
				fileReady : function(file) {
					var me = this;
					var locMod = "fileBtnPostMessage-fileReady";
					me.debugHandler(locMod,"info",locMod);
					try{
						//console.error(file.name);
						var page = me.getPostMessage();
						page.down('#filename').setHtml(file.name);
					}catch(ex){
						me.errHandler(ex,locMod);	
					}
				}
			},
			fileBtnTicket : {
				success : function(path, response){
					//console.error(response);
				},
				failure : function(message, response) {
					var locMod = "fileBtnTicket-Error";
					//console.error("fail");
					//this.uploadPathFail(locMod, message);
				},
				fileReady : function(file) {
					var me = this;
					var locMod = "fileBtnTicket-fileReady";
					me.debugHandler(locMod,"info",locMod);
					try{
						//console.error(file.name);
						var page = me.getTicket();
						page.down('#filenameTicket').setHtml(file.name);
					}catch(ex){
						me.errHandler(ex,locMod);	
					}
				}
			}
			
		}
	},
	launch : function(app) {
		var locMod = "launch";
		var me = this;
		me._build = "1.0.1";
		me.debugHandler(locMod, "info", "SYSTEM STARTED ", me._build + "...");
		
		try {
			locale = mhelpdesk.view.Locale;
			system = mhelpdesk.view.System;
			system.setBuild("Build "+me._build);
			
			//CHECK DEBUG B4 PRODUCTION
			me._isDebug=false;
			app.initDebug(me._isDebug);
						
			me.showMyMasked(locale.getText('msgWaitPage'),false);
		    function displayPage() {
		    	var main = me.getMain();
		    	main.setTopText("normal", me._connection,false,false);
				main.setTopText("normal", system.getBuild(),false,false);
				
		    	main.initScreenMode(me._screenMode);
								
				me.createPathMenu();
				
				me._menu = Ext.create('mhelpdesk.component.MenuHome');
				me.setMenuHome(me._menu);
				if (system.getIsLogin()) {
					//console.error('TEST HERE');
					if (me._deviceOS == "Android" || me._deviceOS == "iOS") {
						
					}else{
						me.subscribeOneSignal(system.getUser(), system.getGroup(), system.getCompanyName());
						
					}
					me.sendAndroidUserTag(system.getUser(), system.getGroup());
				}
				//var mainPage = me.getMainpage();
				//mainPage.initTabItem(me._localConfigStore);
		    }
			var mainApp = function(proceed){
				if (proceed) {
					me.initData();
					var recordConfig=utils.findRecord(me._localConfigStore,"company_id",system.getCompanyId());
					if (recordConfig) {
						system.setPolice(recordConfig.get('default_police'));
						system.setAmbulance(recordConfig.get('default_ambulance'));
						
					}
					me._lang = system.getLanguage();
					locale.localize(me._lang);
					mhelpdesk.app.switchMainView('mhelpdesk.view.Main');
					var theme = system.getTheme();
					var curTheme=me.currentCSS(theme);
					me.changeCSS('resources/css/'+theme, curTheme);
					
					me.debugHandler(locMod, "info", "Init Setting:", "...");		
					me.debugHandler(locMod, "log", "user:", system.getUser());
					me.debugHandler(locMod, "log", "fullname:", system.getFullname());
					//group
					me.debugHandler(locMod, "log", "group:", system.getGroup());
					me.debugHandler(locMod, "log", "isLogin:", system.getIsLogin());
					me.debugHandler(locMod, "log", "language:", system.getLanguage());
					me.debugHandler(locMod, "log", "interval:", system.getTickerInterval());
					if (system.getSound()){						
						me._onSound = true;
						me.debugHandler(locMod, "log", "sound:", 'true');
					}else{						
						me._onSound = false;
						me.debugHandler(locMod, "log", "sound:", 'false');
					}
					me.debugHandler(locMod, "log", "notice:", system.getNotice());
					me.debugHandler(locMod, "log", "color true:", system.getColorTrue());
					me.debugHandler(locMod, "log", "color false:", system.getColorFalse());
					me.debugHandler(locMod, "log", "screenMode:", system.getScreenMode());
					me.debugHandler(locMod, "log", "theme:", system.getTheme());
					
					me.debugHandler(locMod, "log", "companyId:", system.getCompanyId());
					me.debugHandler(locMod, "log", "company Name:", system.getCompanyName());
					me.debugHandler(locMod, "log", "company:", system.getCompany());
					me.debugHandler(locMod, "log", "email:", system.getEmail());
					me.debugHandler(locMod, "log", "phone:", system.getPhone());
					me.debugHandler(locMod, "log", "title:", system.getTitle());
					me.debugHandler(locMod, "log", "member:", system.getMembers());
					me.debugHandler(locMod, "log", "server url:", system.getDefaultServer());
					
					if (system.getRemember()==0) {
						me.updSysSetting('login_flag',0);	
					}
					displayPage();
				}else{
					me.showMyMasked(locale.getText('msgWaitPage'),true, 100000);
					me.debugHandler(locMod,"error","NEW INITIALIZED APP","...");
					//me.sendAndroidUserTag("rudzuan@gmail.com","ADMIN");
					me.load_config(true,function(records,operation,success){
						app.dh("LOAD CONFIG","DONE "+records.length,locMod);
						me.setupData(function(records, operation, success) {	
							app.dh("SETUP DATA","READY "+records.length,locMod);
							mainApp(true);
						});	
					});
						
				}
			}
			me.checkSetting(mainApp);
		} catch (ex) {
			me.errHandler(ex, locMod);
			me.clearCache();
		}
	},
	createMainButton: function() {
		var locMod = this.getItemId()+'.createMainButton';
		var me = this;
		app.dh('Start','...',locMod);
		
		var page = Ext.create('doc.view.GuardPage');
		var mainPanel = page.down('#mainPanel');
		var aryButton = [];
		
		aryButton.push({
			xtype: 'button',
			iconAlign: 'top',
			iconCls: 'fa-motorcycle fa-2x',
			text : 'Dispatch Service',
			listeners: {
				tap : function(thisButton, e, eOpts) {
					page.fireEvent('tapDispatch', page, thisButton, e, eOpts);
				}
			}
		});
		aryButton.push({
			xtype: 'button',
			iconAlign: 'top',
			iconCls: 'fa-pencil-square-o fa-2x',
			text : 'Subscribe to Service',
			listeners: {
				tap : function(thisButton, e, eOpts) {
					page.fireEvent('tapSubscribe', page, thisButton, e, eOpts);
				}
			}
		});
		aryButton.push({
			xtype: 'button',
			iconAlign: 'top',
			iconCls: 'fa-laptop fa-2x',
			text : 'Service Listing',
			listeners: {
				tap : function(thisButton, e, eOpts) {
					page.fireEvent('tapListing', page, thisButton, e, eOpts);
				}
			}
		});
		aryButton.push({
			xtype: 'button',
			iconAlign: 'top',
			iconCls: 'fa-check fa-2x',
			text : 'Check Order',
			listeners: {
				tap : function(thisButton, e, eOpts) {
					page.fireEvent('tapCheckOrder', page, thisButton, e, eOpts);
				}
			}
		});
		aryButton.push({
			xtype: 'button',
			iconAlign: 'top',
			iconCls: 'fa-thumbs-o-up fa-2x',
			text : 'Comments',
			listeners: {
				tap : function(thisButton, e, eOpts) {
					page.fireEvent('tapComment', page, thisButton, e, eOpts);
				}
			}
		});
		aryButton.push({
			xtype: 'button',
			iconAlign: 'top',
			iconCls: 'fa-tasks fa-2x',
			text : 'Order List',
			listeners: {
				tap : function(thisButton, e, eOpts) {
					page.fireEvent('tapOrder', page, thisButton, e, eOpts);
				}
			}
		});
		aryButton.push({
			xtype: 'button',
			iconAlign: 'top',
			iconCls: 'fa-gear fa-2x',
			text : 'Setting',
			listeners: {
				tap : function(thisButton, e, eOpts) {
					page.fireEvent('tapSetting', page, thisButton, e, eOpts);
				}
			}
		});
		
		var breakLine=1;
		var rowPanel;
		var aryRow = [];
		for (var i = 0; i < aryButton.length; i++) {
			//console.error(breakLine);
			if (breakLine==1) {
				rowPanel = Ext.create('Ext.Panel',{
					layout : {
						type: 'hbox',
						pack: 'start',
						align: 'stretch'
					},
					defaults: {
						cls: 'r-main-button'
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
		return page;
		
	},
	doGuardResponse: function(ticket_id, message, callback) {
		var me = this;
		var locMod = this.getItemId()+'.doGuardResponse';
		app.dh('Start','...',locMod);
		var msg;
		var success;
		Ext.Ajax.request({
			useDefaultXhrHeader : false,
			timeout : 5000,
			scope : me,
			url : system.getDefaultServer() + 'mpost.php',
			method : 'post',
			params : {
				ticket_id : ticket_id,
				id : ticket_id,
				message : message
			},
			success : function(response) {
				if (response) {
					var dataResponse = me.getJSON(response.responseText);
					app.dh("Reply Status Success",response.responseText,locMod);
					if (dataResponse) {
						try{
							msg = dataResponse.message;
							success = dataResponse.success;
							if (success) {
								Ext.Ajax.request({
									useDefaultXhrHeader : false,
									timeout : 5000,
									scope : me,
									method: 'POST',
									url : system.getDefaultServer() + 'mactionreply.php',
									method : 'post',
									params : {
										ticket_id : ticket_id
									},
									success : function(response) {	
										if (response) {
											var dataResponse = me.getJSON(response.responseText);
											app.dh("Action Status Success",response.responseText,locMod);
										}
									},
									failure : function(response) {
										if (response) {
											var dataResponse = me.getJSON(response.responseText);
											app.dh("Action Status Fail",response.responseText,locMod);
										}
									}
								});								 
							}
						}catch(ex){
							app.eh(ex,locMod);	
						}
					}
					if (callback) callback(msg,success);
				}
			},
			failure : function(response) {
				if (response) {
					var dataResponse = me.getJSON(response.responseText);
					app.dh("Reply Status Fail",response.responseText,locMod);
					if (dataResponse) {
						
						msg = dataResponse.message;
						success = dataResponse.success;
					}
				}
				if (callback) callback(msg,success);
			}
		});
	},
	doSOS : function() {
		var me = this;
		var locMod = 'controller.doSOS';
		me.dh(locMod,'debug','Start','...');
		var company_id,client_id,name,email,phone,asset_id,topic_id,topicId,subject,message,pri,asset_id,unit_no;
		
		me.load_client(system.getLastId(),true,
			function (records, operations, success) {
				if (records.length>0) {
					var record= records[0];
					company_id = record.get('company_id');
					client_id = record.get('client_id');
					name = record.get('client_firstname') +" "+ record.get('client_lastname');
					email = record.get('client_email');
					phone = record.get('client_phone');
					
					// need to find topic for sos
					topic_id = 2; // record.get('topic_id');
					topicId = 2; //record.get('topicId');
					
					
					
					pri = 4;
					console.error("SOS READY TO SEND "+client_id);
					
					me.load_product(client_id,true,
						function(recordsProduct,operations,success) {
							if (recordsProduct.length>0) {
								var recordProduct = recordsProduct[0];
								//get Client asset n unit no
								asset_id = recordProduct.get('asset_id');
								unit_no = recordProduct.get('serial_no');
								//String.format('{0} is dead, but {1} is alive! {0} {2}', 'ASP', 'ASP.NET');
								console.error("SOS OK TO SEND "+unit_no);
								
								subject = utils.sprintf('SOS Message From occupant %s (%s)!',[name,unit_no]);
								message = utils.sprintf('SOS button is pressed by %s at Unit No %s. Urgent action is required.',[name,unit_no]);
								me.showMyMasked(locale.getText('waitProcess'),false);
								doSubmit(0, 3000);
							}
						});
				}
			});
		function doSubmit(start, timeout) {
			console.error("SOS SEND");
			Ext.Ajax.request({
				useDefaultXhrHeader : false,
				timeout : timeout,
				scope : me,
				method: 'POST',
				url : system.getDefaultServer() + 'mopen.php',
				method : 'post',
				params : {
					company_id : company_id,
					client_id : client_id,
					name : name,
					email : email,
					phone : phone,
					asset_id : asset_id,
					topic_id : topic_id,
					topicId : topicId,
					subject : subject,
					message : message,
					pri : pri
					
				},
				success : function(response) {	
					var ticketID = "";
					var ticket_id = null;
					console.error("SOS SEND SUCCESS");
					try {
						if (response) {
							var dataResponse = me.getJSON(response.responseText);
							if (dataResponse) {
								msg = dataResponse.message;
								if (dataResponse.success) {
									//getRefid
									ticket_id = dataResponse.ticket_id;
									ticketID = dataResponse.ticketID;
									flag = true;
									Ext.Ajax.request({
										useDefaultXhrHeader : false,
										timeout : timeout,
										scope : me,
										method: 'POST',
										url : system.getDefaultServer() + 'maction.php',
										method : 'post',
										params : {
											ticket_id : ticket_id,
											company_id : company_id,
											client_id : client_id,
											name : name,
											email : email,
											phone : phone,
											asset_id : asset_id,
											topic_id : topic_id,
											topicId : topicId,
											subject : subject,
											message : message,
											pri : pri
											
										},
										success : function(response) {	
											//console.log("XXXX");
											//console.error(response);
											//if (response) {
											//var dataResponse = me.getJSON(response.responseText);
										},
										failure : function(response) {
											//console.log("XXXX");
											//console.error(response);
											me.eh("Ticket Alert Fail",locMod);
										}
									});
								}
							}
						}										
					}catch(ex) {
						msg = ex;
					}
					doProcess(flag,msg,ticketID);
				},
				failure : function(response) {
					//console.error(response);
					if (start==0) { 
						doSubmit(1, 10000); 
						return; 
					}
					if (response) {
						var dataResponse = me.getJSON(response.responseText);
						if (dataResponse) {
							msg = response.responseText;
						}
					}
					doProcess(false, msg);									
				}
			});
			}
		function doProcess(flag, msg, ticketID) {
			var page;
			me.hideMyMasked();
			if (flag) {
				console.error("SOS ALERT");				
				//me.sendAndroidUserTag(email,"CLIENT");
				//me.sendAndroidNotification2Role("ADMINISTRATOR", subject, message);
				me.sendAndroidNotification2Segment("STAFF", subject, message);
				me.showMsgBoxOK(locale.getAlertText(),'SOS Message Send',Ext.MessageBox.INFO,true);
			}else{
				me.errHandler(msg,locMod);	
			}		
		}
	},
	doActionTicket : function(client_id, subject, message, visitor,contactNo,vehicleNo,pass,topic_id, callback) {
		var me = this;
		var locMod = this.getItemId()+'.doActionTicket';
		me.dh(locMod,'debug','Start','...');
		var company_id,name,email,phone,asset_id,topicId,pri,asset_id,unit_no;
		
		me.load_client(client_id,true,
			function (records, operations, success) {
				if (records.length>0) {
					var record= records[0];
					company_id = record.get('company_id');
					//client_id = record.get('client_id');
					name = record.get('client_firstname') +" "+ record.get('client_lastname');
					email = record.get('client_email');
					phone = record.get('client_phone');
					
					// need to find topic for Guard Action
					//topic_id = 4; // record.get('topic_id');
					topicId = topic_id; //record.get('topicId');
					
					
					
					pri = 4;
					console.error("ACTION READY TO SEND "+client_id);
					
					me.load_product(client_id,true,
						function(recordsProduct,operations,success) {
							if (recordsProduct.length>0) {
								var recordProduct = recordsProduct[0];
								//get Client asset n unit no
								asset_id = recordProduct.get('asset_id');
								unit_no = recordProduct.get('serial_no');
								//String.format('{0} is dead, but {1} is alive! {0} {2}', 'ASP', 'ASP.NET');
								console.error("ACTION OK TO SEND "+unit_no);
								
								
								subject = utils.sprintf(subject,[name,unit_no]);
								message = utils.sprintf(message,[name,unit_no]);
								doSubmit(0, 3000, callback);
							}
						});
				}
			});
		function doSubmit(start, timeout, callback) {
			console.error("ACTION SEND");
			me.showMyMasked(locale.getText('waitProcess'),false);
			Ext.Ajax.request({
				useDefaultXhrHeader : false,
				timeout : timeout,
				scope : me,
				method: 'POST',
				url : system.getDefaultServer() + 'mopen.php',
				method : 'post',
				params : {
					company_id : company_id,
					client_id : client_id,
					name : name,
					email : email,
					phone : phone,
					asset_id : asset_id,
					topic_id : topic_id,
					topicId : topicId,
					subject : subject,
					message : message,
					pri : pri
					
				},
				success : function(response) {	
					var ticketID = "";
					var ticket_id = null;
					console.error("ACTION SEND SUCCESS");
					try {
						if (response) {
							var dataResponse = me.getJSON(response.responseText);
							if (dataResponse) {
								msg = dataResponse.message;
								if (dataResponse.success) {
									//getRefid
									ticket_id = dataResponse.ticket_id;
									ticketID = dataResponse.ticketID;
									flag = true;
									Ext.Ajax.request({
										useDefaultXhrHeader : false,
										timeout : timeout,
										scope : me,
										method: 'POST',
										url : system.getDefaultServer() + 'maction.php',
										method : 'post',
										params : {
											ticket_id : ticket_id,
											company_id : company_id,
											client_id : client_id,
											name : name,
											email : email,
											phone : phone,
											asset_id : asset_id,
											topic_id : topic_id,
											topicId : topicId,
											subject : subject,
											message : message,
											visitor_name: visitor,
											visitor_phone: contactNo,
											visitor_vehicle: vehicleNo,
											pass_no: pass,
											pri : pri
											
										},
										success : function(response) {	
											//console.log("XXXX");
											//console.error(response);
											//if (response) {
											//var dataResponse = me.getJSON(response.responseText);
										},
										failure : function(response) {
											//console.log("XXXX");
											//console.error(response);
											me.eh("Ticket Alert Fail",locMod);
										}
									});
								}
							}
						}										
					}catch(ex) {
						msg = ex;
					}
					doProcess(flag,msg,ticketID,callback);
				},
				failure : function(response) {
					//console.error(response);
					if (start==0) { 
						doSubmit(1, 10000); 
						return; 
					}
					if (response) {
						var dataResponse = me.getJSON(response.responseText);
						if (dataResponse) {
							msg = response.responseText;
						}
					}
					doProcess(false, msg, null, callback);									
				}
			});		
		}
		function doProcess(flag, msg, ticketID, callback) {
			var page;
			me.hideMyMasked();
			if (flag) {
				console.error("ACTION ALERT");				
				//me.sendAndroidUserTag(email,"CLIENT");
				//me.sendAndroidNotification2Role("ADMINISTRATOR", subject, message);
				me.sendAndroidNotification2Segment("STAFF", subject, message);
				me.showMsgBoxOK(locale.getAlertText(),'Action Message Send',Ext.MessageBox.INFO,true);
			}else{
				me.errHandler(msg,locMod);	
			}
			if (callback) callback(msg, flag);
		}
	},
	doCall : function(telNum, mode) {
		var me = this;
		var locMod = "doCall";
		me.dh('Start','...',locMod);
		
		if (me._deviceOS == "Android" || me._deviceOS == "iOS") {
			var bypassAppChooser = true;
			window.plugins.CallNumber.callNumber(onSuccess, onError, telNum, bypassAppChooser);
		}else{
			me.showMsgBoxOK(locale.getAlertText(),'Only applicable on mobile device!',Ext.MessageBox.ERROR,true);
		}
		
		function onSuccess(result){
		  console.log("Success:"+result);
		  	me.sendAndroidNotification2Segment('STAFF','Alert! Guard House Call Function', 'Activating call to '+mode);
		}
		
		function onError(result) {
		  console.log("Error:"+result);
		}
	},
	refreshMainTitle : function(thisPage) {
		var me = this;
		var locMod="";
		
		try{
			var navBar = thisPage.getNavigationBar();
			//console.error(thisPage.getTitle()+":"+navBar.getTitle());
			if (navBar) {
				
				me.debugHandler(locMod,"warn","Set Title", thisPage.getTitle());
				thisPage.setTitle(system.getTitle());
				navBar.setTitle(system.getTitle());
			}
		}catch(ex){
			me.errHandler(ex,locMod);	
		}
		
	},
	getJSON : function(data) {
		var strReturn = null;
		try{
			return Ext.JSON.decode(data);
		}catch(ex){
			return null;	
		}									
	},
	handleFormError : function(errors, msg) {
		var me = this;
		var locMod = "handleFormError";
		try{
			var errStr = "<div style='color:red;'>";
			if (!msg) {
				Ext.each(errors, function(error, index) {
						errStr += "[" + (index + 1) + "] - " + error.field + " "
								+ error.reason + "<br>";
					});				
			}else{	
				errStr += msg;
			}
			errStr += "</div>";
			var dialog = Ext.Msg.show({
					//cls : "error_msgbox",
					title : locale.getFailText(),
					message : errStr,
					width : '50%',
					buttons : Ext.MessageBox.OK,
					iconCls : Ext.MessageBox.ERROR,
					closable : true,
					modal : true,
					autoDestroy : true,
					waitConfig : {
						interval : 200
					},
					fn : function(buttonId) {
						dialog.hide();
					}
				});
		}catch(ex){
			me.errHandler(ex,locMod);	
		}
	},
	uploadSetPath : function(objPath, objImage, path) {
		var locMod = "uploadSetPath";
		var me = this;
		try {
			objPath.setValue(path);
			objImage.setSrc('images/' + path);
			me.showToast(locale.getText('msgAddSuccess'));
		} catch (ex) {
			me.showToast(locale.getText('msgTransFail'));
			me._debugModule = locMod;
			me.errHandler(ex);
		}
	},
	uploadPathFail : function(locMod, msg) {
		var me = this;
		var locMod = "uploadPathFail";
		me.showToast(locale.getText('msgTransFail'));
		me._debugModule = locMod;
		me.errHandler(msg);
	},
	getPhoto : function(thisButton, filePath, loadedImage) {
		var locMod = "getPhoto";
		var me = this;
		try {
			var urlServer = 'images'; //system.getUrlPostPicture(); // me._urlPostPicture;
			if (navigator.camera) {
				// device camera - cordova
				navigator.camera.getPicture(onSuccess, onFail, {
							quality : 50,
							destinationType : Camera.DestinationType.FILE_URI
						});
				// destinationType: Camera.DestinationType.DATA_URL });
			} else {
				me.showToast(locale.getText("noCamera"), 3);
			}

			// capture success callback
			function onSuccess(imageURI) {
				var lostor = Ext.getStore('localLoadedImageStore');
				me._localSubjectTimetableStore.removeAll(false);
		        lostor.add({
		        	src: imageURI,
		        	timestamp: new Date().getTime()
		        });
		        lostor.sync();
		        //console.log("FILE PATH!!!!! "+imageURI);
		        filePath.setValue(imageURI);
				loadedImage.setSrc(imageURI);
		        //me.showToast(imageURI, 3)
				//me.showMyMasked(locale.getText('waitProcess'), false);
				//uploadPhoto(imageURI);
			}
			// capture fail callback
			function onFail(message) {
				me.uploadPathFail("getPhoto", message);
				// alert('Failed because: ' + message);
				// me.showMsgBoxOK(locale.getFailText(), locale
				// .getText('msgTransFail'), Ext.Msg.ERROR, false);
			}

			function uploadPhoto(imageURI) {
				var locMod = "uploadPhoto";
				try {
					var options = new FileUploadOptions();
					options.fileKey = "userfile";
					options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
					options.mimeType = "image/jpeg";

					var params = {};
					params.username = me._user;
					// params.value2 = "param";

					options.params = params;

					var ft = new FileTransfer();
					ft.upload(imageURI, encodeURI(urlServer), win, fail, options);
					// ft.upload(imageURI, encodeURI("remote/getfile.php"), win,
					// fail, options);
				} catch (ex) {
					me._debugModule = locMod;
					me.errHandler(ex);
				}
			}

			// upload success callback
			function win(r) {
				var response = Ext.decode(r.response, true);
				me.uploadSetPath(filePath, loadedImage, response.path);

				// filePath.setValue(response.path);
				// loadedImage.setSrc(system.getUrlPicturePath() +
				// response.path);
				// loadedImage.setHidden(false);
				me.hideMyMasked();
				// me.showToast(locale.getText('msgAddSuccess'));

				// console.log("Upload Code = " + r.responseCode);
				// console.log("Upload Response = " + r.response);
				// console.log("Upload Sent = " + r.bytesSent);
				// MIUp.app.getController('General').oneImageSuccess(r.response);
			}

			function fail(error) {
				me.uploadPathFail("getPhoto", error);
				// me.showMsgBoxOK(locale.getFailText(),
				// 'File fail to upload, try again ...', Ext.Msg.OK, true);
				// console.log("An error has occurred: Code = " + error.code);
				// console.log("Upload upload error source " + error.source);
				// console.log("Upload upload error target " + error.target);
				// MIUp.app.getController('General').oneImageFail(error.source);
			}
		} catch (ex) {
			me._debugModule = locMod;
			me.errHandler(ex);
		}

	},
	doHelp : function(thisPage) {
		var me = this;
		var locMod = thisPage.getItemId() + "-help";
		me.debugHandler(locMod, "info", "help module", "...");
	},
	pushPage : function(page) {
		var me = this;
		var locMod = "pushPage";
		me.debugHandler(locMod, "info", locMod, page.getItemId());
		try {
			// console.error("test");
			var main = me.getMain();
			
			var curPageID = main.getActiveItem().getItemId();
			if (page.getItemId() != curPageID) {
				
				main.push(page);
				me._countNav = me._countNav + 1;
				if (me._backItem) {
					//console.error(me._countNav);
					if (me._countNav > 0) {
						app.dh('push',"enable backItem",locMod);
						me._backItem.setDisabled(false);
					}
				}
			}
			
		} catch (ex) {
			// console.error("pushPage " + ex);
			me.errHandler(ex, locMod);
		}
	},
	popPage : function(noPage) {
		var me = this;
		var locMod = "popPage";
		me.debugHandler(locMod,"info",locMod);
		try {
			var main = me.getMain();
			if (noPage) {
				main.pop(noPage);
			} else {
				main.pop();
			}
			me._countNav = me._countNav - 1;
			if (me._countNav <= 0) {
				console.error(me._countNav);
			
				if (me._backItem) {
					app.dh('pop',"disable backItem",locMod);
					me._backItem.setDisabled(true);
				}
			}
			main.getLayout().setAnimation(true);
//			if (me._maskShow) {
//				utils.showMyMasked();
//				main.getLayout().setAnimation(true);
//			}

		} catch (ex) {
			me.errHandler(ex, locMod);
		}
	},
	doPop : function() {
		var me = this;
		var locMod = "doPop";
		try {
			var thisNav = me.getMain();
			me._countNav = me._countNav - 1;
			if (me._countNav <= 1) {
				me._countNav = 0;
				var navBar = thisNav.getNavigationBar();
			
				if (navBar) {
					navBar.down('#btnBack').setHidden(true);
				}
				//console.error(navBar.down('#btnBack'))
			}
			
			//console.log("NAV POP:" + me._countNav);
			var curPageID = thisNav.getActiveItem().getItemId();
			me.debugHandler(locMod,"info","NAV POP "+me._currentPage.getItemId()+":"+curPageID,me._countNav);
			
//						var curPage = thisNav.getActiveItem();
//						console.log("Page:" + curPage.getItemId());
			
			//console.log("Page:" + curPageID);
//						if (me._currentPage.getItemId() == curPageID) {
//							var prevItem = thisNav.getPreviousItem();
//							if (prevItem) {
//								console.error(prevItem.getItemId());
//								thisNav.setActiveItem(prevItem);
//							}
//						}
			me._currentPage = thisNav.getActiveItem();
			if (me._countNav <= 1) {
				if (me._backItem) {
					//console.error("disable backItem");
					me._backItem.setDisabled(true);
				}
			}
		} catch (ex) {
			me.errHandler(ex, locMod);
		}
	},
	getCurrentPage : function(menu) {
		var locMod = "getCurrentPage";
		var me = this;
		var currPage = null;
		try {

			if (!this._currentPage) {
				console.log("4: MENU:" + menu);
				switch (menu) {
					case "mnuGuardSetup" : 
						break;
					case "mnuSchedule" :
						currPage = new Ext.create("mhelpdesk.view.TimetableNew");
						break;
					case "mnuSetting" :
						currPage = me.getSystemConfig();
						break;	
					case "mnuUpload" :
						currPage = new Ext.create("mhelpdesk.view.FileUpload");
						break;
					case "mnuLogin" :
						currPage = new Ext.create("mhelpdesk.view.Login");
						break;	
					case "mnuIntercom" :
						currPage = new Ext.create("mhelpdesk.view.Intercom");					
						break;
					case "menuHomeHome" :
						// case "menuHome99" :
						// case "menuProfileHome" :
						// me._CurrentPage = me.getMainpage();
						this._currentPage = null;
						// me.gotoHome();
						currPage = me.getMainpage();
						break;
				}
			}
		} catch (ex) {
			me.errHandler(ex, locMod);
		}
		return currPage;
	},
	doLogout: function() {
		var me = this;
		var locMod = "controller.doLogout";
			
		me.updSysSetting('login_flag',0);
		me.updSysSetting('login_remember', 0);
		me.clearCache();
		
	},
	doDelay : function(timer, functionCall) {
		var me = this;
		var locMod = "doDelay";
		try {
			var delayTask = Ext.create('Ext.util.DelayedTask', functionCall, me);
			delayTask.delay(timer);
		} catch (ex) {
			me._debugModule = locMod;
			me.errHandler(ex);
		}

	},
	showDebugData : function(locMod, type, store, count) {
		var me = this;
		var debugType = "info";
		if (type == "REMOTE") {
			debugType = "warn";
		}
		me.debugHandler(locMod, debugType, "LOADED " + type + " "
						+ store.getStoreId(), "(" + count + ")");
	},
	showMsgBoxOK : function(title, msg, type, autoCloseFlag) {
		var me = this;
		var locMod = "showMsgBoxOK";
		try {

			var answer = null;
			if (autoCloseFlag === undefined)
				autoCloseFlag = true;
			var dialog = Ext.Msg.show({
						cls : "success_msgbox",
						title : title, // 'Status',
						message : msg, // 'Changes Saved Successfully',
						width : '50%',
						buttons : Ext.MessageBox.OK,
						iconCls : type, // Ext.MessageBox.INFO,
						closable : true,
						modal : true,
						autoDestroy : true,
						waitConfig : {
							interval : 200
						},
						fn : function(buttonId) {
							dialog.hide();
						}
					});
			if (autoCloseFlag) {
				me.doDelay(5000, function() {
							// console.log("hide dialog");
							if (!dialog.isHidden()) {
								dialog.hide();
								// dialog.destroy();
							}
						});
			}
		} catch (ex) {
			me.errHandler(err, locMod);
		}

	},
	showConfirm : function(title, msg, callback) {
		Ext.Msg.confirm(title, msg, function(buttonID, value, opts) {
			if (callback) {
				// buttonID "no" OR "yes"
				callback(buttonID, value, opts);
			}
				// if (buttonID === "no") {
				// // whew. Threat averted!
				// } else {
				// // oh noes! the internet is going down
				// me.doLogout();
				// }
			});
	},
	showToast : function(msg, waitTime) {
		var defaultWait = 3000; // 3sec
		if (waitTime) {
			defaultWait = waitTime * 1000;
		}
		Ext.toast(msg, defaultWait);

	},
	showMyMasked : function(msg, autoHide, delay) {
		var locMod = "showMyMasked";
		var me = this;
		var hideMe;
		var delayValue = 3000;
		if (!autoHide || autoHide == false) {
			hideMe = false;
		} else {
			hideMe = true;
		}
		if (delay) {
			delayValue = delay;	
		}
		try {
			me._maskShow = true;
			me.debugHandler(locMod, "warn", "Show Masked", "...");
			this._currentView = mhelpdesk.app.getCurrentViewPage();
			if (this._currentView) {
				this._currentView.setMasked({
							xtype : 'loadmask',
							message : msg
						});
				if (hideMe) {
					me.doDelay(delayValue, function() {
								me.hideMyMasked();
							});
				}
			}
		} catch (ex) {
			me.errHandler(ex, locMod);
		}
	},
	displayError : function(thisField,errMsg,autoHide) {
		var locMod = "displayError";
		var me = this;
		var hideMe=true;
		if (!autoHide || autoHide == false) {
			hideMe = false;
		} 
		try {
			thisField.setHtml(errMsg);
			if (hideMe) {
				//console.error("Clear");
				me.doDelay(3000, function() {
								thisField.setHtml("");
							});	
			}
			
		} catch (ex) {
			me.errHandler(ex, locMod);
		}
	},
	hideMyMasked : function() {
		try {
			if (this._currentView) {
				this._currentView.setMasked(false);
			}
		} catch (ex) {
		}
	},

	menuClick : function(button, e, eOpts) {
		var locMod = "menuClick";
		var me = this;

		//console.error("SET Menu ");
		this.debugHandler(locMod, "info", "SET MENU", "...");
		if (!me._isPlaying) {
			// me.playSound('button-click');
		}
		// console.log(button);
		// if (this._menuOpen && this._menuCurrent == "HOME") {
		if (this._menuOpen) {
			Ext.Viewport.hideAllMenus();
			this._menuOpen = false;

		} else {
			this._menuOpen = true;
			// this._menuCurrent = "HOME";menuClick

			// console.log(me._menu);
			Ext.Viewport.setMenu(me._menu, {
						side : 'left',
						reveal : true
					});
			Ext.Viewport.toggleMenu("left");
		}

	},
	setMenuActivity : function(menu) {
		var locMod = "setMenuActivity";
		var me = this;
		switch (me._sysRole) {
			case "ADMIN" :
				menu.down('#mnuCreateEvent').setHidden(false);
				break;
			default :
				break;
		}
	},
	setMenuNotification : function(menu) {
		var locMod = "setMenuNotification";
		var me = this;
		app.dh('Start','..',locMod);
		
		switch (me._sysRole) {
			case "ADMIN" :
				menu.down('#mnuCreateNotification').setHidden(false);
				break;
			default :
				break;
		}
	},
	setMenuHome : function(menu) {
		var locMod = "setMenuHome";
		var me = this;
		app.dh('Start','..',locMod);
		try {
			switch (me._sysRole) {
				case "ADMIN" :
				default :
					break;
			}
			// menu.down('#mnuSetupUser').setHidden(true);
			// if (me._user == "admin") {
			// menu.down('#mnuSetupUser').setHidden(false);
			// }
			if (system.getIsLogin()) {
//				menu.down('#mnuIntercom').setHidden(false);	
//				menu.down('#mnuExternalCall').setHidden(false);
//				menu.down('#mnuBilling').setHidden(false);
			}else{
//				menu.down('#mnuIntercom').setHidden(true);	
//				menu.down('#mnuExternalCall').setHidden(true);
//				menu.down('#mnuBilling').setHidden(true);
			}
			
		} catch (ex) {
			me.errHandler(ex, locMod);
		}
	},
	stopSound : function() {
		var me = this;
		var locMod = "stopSound";
		try {
			if (me._soundMedia) {
				if (me._deviceOS == "Android" || me._deviceOS == "iOS") {
					try {
						me._soundMedia.stop();
					} catch (ex) {
						me.errHandler(ex, locMod);
					}
					me._soundMedia.release();
				}
			}
		} catch (ex) {
			me.errHandler(ex, locMod);
		}
	},
	playSound : function(soundItem) {
		var me = this;
		var locMod = "playSound";
		try {
			var mp3URL = null;
			switch (soundItem) {
//				case 'subject-found' :
//					mp3URL = this.getMediaURL("sounds/subject-found.3gpp");
//					break;
//				case 'subject-notfound' :
//					mp3URL = this.getMediaURL("sounds/subject-notfound.3gpp");
//					break;
				case 'button-tap' :
					mp3URL = this.getMediaURL("sounds/Click-kit-wood.mp3");
					// Pause after 1/2 seconds
					setTimeout(function() {
								if (me._isPlaying) {
									me.stopSound();
								}
							}, 3000);
					break;
				case 'button-back' :
					mp3URL = this.getMediaURL("sounds/Click-kit.mp3");
					// Pause after 1/2 seconds
					setTimeout(function() {
								if (me._isPlaying) {
									me.stopSound();
								}
							}, 3000);
					break;
				case 'button-click' :
					mp3URL = this.getMediaURL("sounds/button-click.mp3");
					// Pause after 1/2 seconds
					setTimeout(function() {
								if (me._isPlaying) {
									me.stopSound();
								}
							}, 3000);
					break;
				case 'path-menu-open' :
					mp3URL = this.getMediaURL("sounds/PathMenu-open.mp3");
					// Pause after 1/2 seconds
					setTimeout(function() {
								if (me._isPlaying) {
									me.stopSound();
								}
							}, 3000);
					break;
				case 'path-menu-close' :
					mp3URL = this.getMediaURL("sounds/PathMenu-close.mp3");
					// Pause after 1/2 seconds
					setTimeout(function() {
								if (me._isPlaying) {
									me.stopSound();
								}
							}, 3000);
					break;
				case 'menu' :
					mp3URL = this.getMediaURL("sounds/menu-click.mp3");
					setTimeout(function() {
								if (me._isPlaying) {
									me.stopSound();
								}
							}, 3000);
					break;
				case 'tab' :
					mp3URL = this.getMediaURL("sounds/menu-click.mp3");
					setTimeout(function() {
								if (me._isPlaying) {
									me.stopSound();
								}
							}, 3000);
					break;
				case 'intro' :
					var no = Math.floor(Math.random()*(3-1+1)+1); 
					if (no == 1) {
						mp3URL = this.getMediaURL("sounds/opening-sound1.mp3");
					} else if (no == 2) {
						mp3URL = this.getMediaURL("sounds/opening-sound2.mp3");
					} else {
						mp3URL = this.getMediaURL("sounds/opening-sound3.mp3");
					}

					break;
				case 'alarm' :
					mp3URL = this.getMediaURL("sounds/alarm-notify.mp3");
					break;
				case 'shutdown' :
					mp3URL = this.getMediaURL("sounds/shutdown-sound.mp3");
					break;
				case 'error' :
					mp3URL = this.getMediaURL("sounds/problem-sound.mp3");
					break;
				case 'ok' :
					mp3URL = this.getMediaURL("sounds/ok.mp3");
					break;
				case 'no' :
					mp3URL = this.getMediaURL("sounds/no.mp3");
					break;
				default :
					mp3URL = this.getMediaURL(soundItem);
					break;

			}
			if (me._onSound) {
				//me.showToast("Sound OK?"+soundItem, 3);
				// me.showToast("On Sound ...", 3);
				if (me._deviceOS == "Android" || me._deviceOS == "iOS") {
					// me.showToast("Android OK "+mp3URL, 3);
					if (mp3URL) {
						me._soundMedia = new Media(mp3URL, null, this.mediaError,
								this.mediaStatus);
						if (me._isPlaying) {
							me.stopSound();
						}
						// me.showToast("Media Ready ...", 3);
						me._isPlaying = true;
						me._soundMedia.play();
					}
				}
			}else{
				//me.showToast("Sound NOT OK?"+soundItem, 3);
			}
		} catch (ex) {
			navigator.notification.beep(1);
			me.stopSound();
			me.errHandler(ex, locMod);
			//me.showToast("Error"+ex, 3);

		}
	},
	getMediaURL : function(s) {
		var me = this;
		var locMod = "getMediaURL";
		try {
			if (me._deviceOS == "Android") {
				return "/android_asset/www/" + s;
			} else if (me._deviceOS == "iOS") {
				return s;
			} else {
				return system.getDefaultServer() + s;
			}

		} catch (ex) {
			me.errHandler(ex, locMod);
			//me.showToast("Err " + ex, 3);
			return null;
		}
	},
	mediaStatus : function(status) {
		var me = this;
		var locMod = "mediaStatus";
		try {
			// me.showToast("Media Status Ready ..."+status, 3);
			// Media.MEDIA_NONE = 0;
			// Media.MEDIA_STARTING = 1;
			// Media.MEDIA_RUNNING = 2;
			// Media.MEDIA_PAUSED = 3;
			// Media.MEDIA_STOPPED = 4;
			if (status == 0 || status == 3 || status == 4) {
				me._isPlaying = false;
			}
		} catch (ex) {
			me.errHandler(ex, locMod);
		}
	},
	mediaError : function(e) {
		var me = this;
		var locMod = "mediaError";
		try {
			//me.showToast("Media Error ...", 3);
			me.updSysSetting('sound', 0);
			me._onSound = false;
			system.setSound(me._onSound);
			// Ext.Msg.alert('Media Error'+e.code);
			// Ext.Msg.alert(JSON.stringify(e));
		}catch(ex){
			
		}
	},
	onGlobalevent : function() {

		// ('Global Event Fired');

	},
	onDeviceready : function(deviceOS, browser, deviceType) {
		var locMod = "onDeviceready";
		var me = this;
		me.debugHandler(locMod,"info",locMod);
		try {
			//me.showToast("Device Ready, Initiating Connection ...", 3);
			//var main = me.getMain();
			me._deviceOS = deviceOS;
			//system.setDeviceOS(me._deviceOS);
			me._browser = browser;
			me._deviceType = deviceType;
			me.showToast("Initiating " + me._deviceOS, 3);
			if (me._deviceOS == "Android" || me._deviceOS == "iOS") {
				
				navigator.notification.beep(2);

				//me.playSound('intro');
				try {
					me.checkConnection();
					window.open = cordova.InAppBrowser.open;
					// this.debugHandler(locMod, "info", "Detect Platform ",
					// me._deviceOS);
					//main.setBottomText("Detect Platform " + me._deviceOS, false, true, 500);
					
					Ext.device.FileSystem.requestFileSystem({
								type : PERSISTENT,
								size : 50 * 1024 * 1024, // 50mb -- gonna store
								// video
								success : function(fileSystem) {
									me.debugHandler(locMod, "info",
											"requestFileSystem SUCCESS", "...");
	
									me._deviceFileSystem = fileSystem; // .root;
									me._devicePath = fileSystem.fs.root.fullPath; // .root.fullPath;
									me.debugHandler(locMod, "info",
									 "requestFileSystem", me._devicePath + "...");
	//								main.setBottomText("requestFileSystem SUCCESS"
	//												+ me._devicePath, false, true,
	//										500);
								},
	
								failure : function() {
									me.showToast("requestFileSystem FAIL", 3);
									// me.debugHandler(locMod, "error",
									// "requestFileSystem FAIL", "...");
	//								main.setBottomText("requestFileSystem FAIL ",
	//										false, true, 500);
								}
	
							});
							
					var notificationOpenedCallback = function(jsonData) {
						try {
							// use JSON.stringify to convert it to json string
							var jsonstring = JSON.stringify(jsonData);
							// convert json string to json object using JSON.parse
							// function
							var jsonobject = JSON.parse(jsonstring);
							me._isPullProcess = true;
							// me.showToast(jsonobject.additionalData+"-"+jsonobject.message,
							// 5000);
							if (me._deviceOS == "Android" || me._deviceOS == "iOS") {
								navigator.notification.beep(2);
							}
							me.showNotificationBadge();
							me.showFeedbackBadge();
	
							me.doDelay(10000, function() {
										// clear until next incoming new items
										me._isPullProcess = false;
									});
							// me.showMsgBoxOK(jsonobject.additionalData,
							// jsonobject.message, Ext.MessageBox.INFO);
	
							// Ext.Msg.alert("Notification received:\n" +
							// JSON.stringify(jsonData));
							// me.showMsgBoxOK("Notification received:\n",
							// JSON.stringify(jsonData), Ext.MessageBox.INFO);
							// console.log('didReceiveRemoteNotificationCallBack: '
							// + JSON.stringify(jsonData));
						} catch (ex) {
							me.errHandler(ex, locMod
											+ '-notificationOpenedCallback');
						}
					};
	
					window.plugins.OneSignal.init(
							"1b1b57f7-fdae-47c1-a9e5-453b9992a2ba", {
								googleProjectNumber : "738763005130" 
							}, notificationOpenedCallback);
							
//					var config = {
//					    isInitiator: true,
//					    turn: {
//					        //host: 'turn:turn.example.com:3478',
//					        //username: 'test',
//					        //password: '123'
//					    	host: '110.74.184.36',
//					    	username: '200',
//					    	password: 'u5he200rhtdw'
//					    },
//					    streams: {
//					        audio: true,
//					        video: false
//					    }
//					}	
//					
//					
//					me._session = new cordova.plugins.phonertc.Session(config);
//					me._session.on('answer', function () { 
//					    //console.log('Other client answered!');
//					    app.dh('answer','Other client answered!',locMod);
//					});
//					
//					me._session.on('disconnect', function () { 
//					    //console.log('Other client disconnected!');
//					    app.dh('disconnect','Other client disconnected!!',locMod);
//					});
//					me._session.on('sendMessage', function (data) { 
//					    signaling.send('201', 'Hi Rudzuan Test Message');
//					});
//					signaling.onMessage = function (message) {
//					    me._session.receiveMessage(message);
//					};
					
					me._socket = io.connect('110.74.184.36');
					me._socket.on('messageReceived', onVideoMessageReceived);
					me._socket.on('onMessage', function(message) {
					    me._session.receiveMessage(message);
					});

				}catch(ex){
					
				}
		
			}
		} catch (ex) {

		}
		
	},
	call: function (isInitiator) {
		var locMod = this.getItemId()+".call";
		var me = this;
	    var config = {
	        isInitiator: isInitiator,
	        turn: {
	            //host: turn.url,
	            //username: turn.username,
	            //password: turn.credential
	            host: '110.74.184.36',
		    	username: '201',
		    	password: 'spa201fsw'
	        },
	        streams: {
	            audio: true,
	            video: true
	        }
	    };
	    try{
	    me._session = new cordova.plugins.phonertc.Session(config);
	    me._session.on('answer', function () { 
		    //console.log('Other client answered!');
		    app.dh('answer','Other client answered!',locMod);
		});
		
		me._session.on('disconnect', function () { 
		    //console.log('Other client disconnected!');
		    app.dh('disconnect','Other client disconnected!!',locMod);
		});
//	    cordova.plugins.phonertc.setVideoView({
//	        container: document.getElementById('videoContainer'),
//	        local: {
//	            position: [0, 0],
//	            size: [100, 100]
//	        }
//	    });
	    me._session.on('sendMessage', function(data) {
	    	app.dh('sendMessage',data,locMod);
	        me._socket.emit('sendMessage', {
	            type: 'phonertc_handshake',
	            data: JSON.stringify(data)
	        });
	    });
	    me._session.call();
	    }catch(ex){
	    	app.eh(ex,locMod);	
	    }
	},
	onVideoMessageReceived: function (message) {
		var me = this;
	    switch (message.type) {
	        case 'call':
	            //$('#answer').show();
	            break;
	        case 'answer':
	            me.call(true);
	            break;
	        case 'phonertc_handshake':
	            // run this only once during the start of a call
	            me._session.receiveMessage(JSON.parse(message.data));
	            break;
	    }
	},
	subscribeOneSignal : function(user, role, company) {
		var me = this;
		var locMod = this.getItemId()+'.subscribeOneSignal';
		if (system.getIsDebug()) return;
		me.OneSignal = window.OneSignal || [];
		me.OneSignal.push(function() {
		  // Be sure to call this code *before* you initialize the web SDK
		  
		  // This registers the workers at the root scope, which is allowed by the HTTP header "Service-Worker-Allowed: /"
		  me.OneSignal.SERVICE_WORKER_PARAM = { scope: '/' };
		});
		
		me.OneSignal.push(["init", {
		  appId: "1b1b57f7-fdae-47c1-a9e5-453b9992a2ba",
		  // Your other init settings
		  //subdomainName: 'wtpropertycheck.onesignal.com',
		  autoRegister : true,
      	  notifyButton: {
      		showCredit: false, // Hide the OneSignal logo
      	  	size: 'medium', // One of 'small', 'medium', or 'large'
	    	theme: 'inverse', // One of 'default' (red-white) or 'inverse" (white-red)
		    position: 'bottom-right', // Either 'bottom-left' or 'bottom-right'
		    offset: {
		      bottom: '0px',
		      left: '0px', // Only applied if bottom-left
		      right: '0px' // Only applied if bottom-right
		    },
		    text: {
			      'tip.state.unsubscribed': 'Subscribe to wtProperty notifications',
			      'tip.state.subscribed': "You're subscribed to wtProperty notifications",
			      'tip.state.blocked': "You've blocked notifications",
			      'message.prenotify': 'Click to subscribe to notifications',
			      'message.action.subscribed': "Thanks for subscribing!",
			      'message.action.resubscribed': "You're subscribed to wtProperty notifications",
			      'message.action.unsubscribed': "You won't receive notifications again",
			      'dialog.main.title': 'wtProperty Notifications Subscription',
			      'dialog.main.button.subscribe': 'SUBSCRIBE',
			      'dialog.main.button.unsubscribe': 'UNSUBSCRIBE',
			      'dialog.blocked.title': 'Unblock Notifications',
			      'dialog.blocked.message': "Follow these instructions to allow notifications:"
			},
          	enable: true // Set to false to hide
      	  }	
		}]);
		me.OneSignal.push(function() {
	   		me.OneSignal.on('subscriptionChange', function(isSubscribed) {
		   	    if (isSubscribed) {
		   	      // The user is subscribed
		   	      //   Either the user subscribed for the first time
		   	      //   Or the user was subscribed -> unsubscribed -> subscribed
		   	      me.OneSignal.getUserId( function(userId) {
		   	        	// Make a POST call to your server with the user ID
		     	    	//    alert(userId);
		   	      		me.dh('Subscribe',userId, locMod);
		     	       	me.OneSignal.push(["sendTags", {
				     	       	user: user, 
				     	       	role: role, 
				     	       	company: system.getCompanyName()
			     	       	}
		     	       	]);
		   	      });
		   	    }
	   	  	});
	   	});
	   	me.sendAndroidNotification2Role('ADMINISTRATOR','Login',"User "+user+" just login ...");
	},
	sendAndroidNotification2Role : function(role, title, message, sendDate, callback) {
		var me = this;
		var locMod = "sendAndroidNotification2Role";
		me.debugHandler(locMod, "info", "SEND ANDROID NOTIFICATION");
		if (system.getIsDebug()) return;
		try {
			var myTitle, enTitle;
			var myMsg, enMsg;

			myTitle = locale.getText(title, 'ms_MY');
			enTitle = locale.getText(title, 'en');

			myMsg = locale.getText(message, 'ms_MY');
			enMsg = locale.getText(message, 'en');
			
			var obj = {
				success : false,
				message : null
			};
			var utcDate = null;
			if (sendDate) {
				utcDate = sendDate.toUTCString();
			}

			var paramSend = {
				send_after : utcDate,
				role : role,
				company : system.getCompanyName(),
				title : title,
				msg : message,

				myTitle : myTitle,
				enTitle : enTitle,

				myMsg : myMsg,
				enMsg : enMsg
			};
			
			var msg = locale.getText("msgTransFail");
			var data;
			Ext.Ajax.request({
				url : system.getDefaultServer() + 'remote/sendNotification.php',
				method : 'post',
				params : paramSend,
				success : doProcess,
				failure : doProcess
			});
			function doProcess(response) {
				var dataResponse = me.getJSON(response.responseText);
				var status = "FAIL";
				var flag = "error";
				var blnFlag = false;
				if (dataResponse){
					msg = dataResponse.message;
					data = dataResponse.data;
					var dataMessage = me.getJSON(msg);
					if (dataMessage){
						if (dataMessage.id) {
							status = "PASS";
							flas = "info";
							blnFlag = true;
						}
					}
				}
				me.debugHandler(locMod, 'info', "Send Log "+role+system.getCompanyName(), msg);
				me.debugHandler(locMod, flag, " Send Android Notification "+status, data);	
				obj.success = blnFlag;
				obj.message = dataResponse.message;
				if (callback) callback(obj);
			}
		} catch (ex) {
			me._debugModule = locMod;
			me.errHandler(ex);
		}
	},
	sendAndroidNotification2Segment : function(segment, title, message, sendDate, callback) {
		var me = this;
		var locMod = "sendAndroidNotification2Segment";
		me.debugHandler(locMod, "info", "SEND ANDROID NOTIFICATION");
		if (system.getIsDebug()) return;
		try {
			var myTitle, enTitle;
			var myMsg, enMsg;

			myTitle = locale.getText(title, 'ms_MY');
			enTitle = locale.getText(title, 'en');

			myMsg = locale.getText(message, 'ms_MY');
			enMsg = locale.getText(message, 'en');
			
			var obj = {
				success : false,
				message : null
			};
			var utcDate = null;
			if (sendDate) {
				utcDate = sendDate.toUTCString();
			}

			var paramSend = {
				send_after : utcDate,
				segment : segment,
				company : system.getCompanyName(),
				title : title,
				msg : message,

				myTitle : myTitle,
				enTitle : enTitle,

				myMsg : myMsg,
				enMsg : enMsg
			};
			
			var msg = locale.getText("msgTransFail");
			var data;
			Ext.Ajax.request({
				url : system.getDefaultServer() + 'remote/sendNotification.php',
				method : 'post',
				params : paramSend,
				success : doProcess,
				failure : doProcess
			});
			function doProcess(response) {
				var dataResponse = me.getJSON(response.responseText);
				var status = "FAIL";
				var flag = "error";
				var blnFlag = false;
				if (dataResponse){
					msg = dataResponse.message;
					data = dataResponse.data;
					var dataMessage = me.getJSON(msg);
					if (dataMessage){
						if (dataMessage.id) {
							status = "PASS";
							flas = "info";
							blnFlag = true;
						}
					}
				}
				me.debugHandler(locMod, 'info', "Send Log "+segment, msg);
				me.debugHandler(locMod, flag, " Send Android Notification "+status, data);	
				obj.success = blnFlag;
				obj.message = dataResponse.message;
				if (callback) callback(obj);
			}
		} catch (ex) {
			me._debugModule = locMod;
			me.errHandler(ex);
		}
	},
	// TODO send by user
	sendAndroidNotification2User : function(user, title, message, sendDate, callback) {
		var me = this;
		var locMod = "sendAndroidNotificationUser";
		me.debugHandler(locMod, "info", "SEND ANDROID NOTIFICATION TO ", user);
		if (system.getIsDebug()) return;
		try {
			var myTitle, enTitle;
			var myMsg, enMsg;

			myTitle = locale.getText(title, 'ms_MY');
			enTitle = locale.getText(title, 'en');

			myMsg = locale.getText(message, 'ms_MY');
			enMsg = locale.getText(message, 'en');
			
			var obj = {
				success : false,
				message : null
			};
			var utcDate = null;
			if (sendDate) {
				utcDate = sendDate.toUTCString();
			}

			var paramSend = {
				send_after : utcDate,
				user : user,
				company : system.getCompanyName(),
				title : title,
				msg : message,

				myTitle : myTitle,
				enTitle : enTitle,

				myMsg : myMsg,
				enMsg : enMsg
			};
			
			Ext.Ajax.request({
				url : system.getDefaultServer() + 'remote/sendNotification.php',
				method : 'post',
				params : paramSend,
				success : doProcess,
				failure : doProcess
			});
			function doProcess(response) {
				var dataResponse = me.getJSON(response.responseText);
				var status = "FAIL";
				var flag = "error";
				var blnFlag = false;
				if (dataResponse){
					msg = dataResponse.message;
					data = dataResponse.data;
					var dataMessage = me.getJSON(msg);
					if (dataMessage){
						if (dataMessage.id) {
							status = "PASS";
							flas = "info";
							blnFlag = true;
						}
					}
				}
				me.debugHandler(locMod, 'info', "Send Log "+user+ system.getCompanyName(), msg);
				me.debugHandler(locMod, flag, " Send Android Notification "+status, data);	
				obj.success = blnFlag;
				obj.message = dataResponse.message;
				if (callback) callback(obj);
			}
		} catch (ex) {
			me.errHandler(ex, locMod);
		}
	},
	sendAndroidUserTag : function(user, role) {
		var me = this;
		var locMod = "sendAndroidUserTag";
		me.debugHandler(locMod, "info", "END USER TAGS ",
				me._sysRole);
		try {
			if (me._deviceOS == "Android" || me._deviceOS == "iOS") {
				window.plugins.OneSignal.sendTags({
							user : user,
							company :  system.getCompanyName(),
							role : role
						});
				// console.info("SEND USER TAGS: DONE");
			}
		} catch (ex) {
			me._debugModule = locMod;
			me.errHandler(ex);
		}
	},
	onBackbutton : function(e) {
		var locMod = "onBackbutton";
		var me = this;
		try {

		} catch (ex) {

		}
	},
	onOffline : function() {
		var me = this;
		var locMod = "onOffline";
		// var mainPage = me.getMain();
		var page = null;
		try {

		} catch (ex) {

		}
	},
	onOnline : function() {
		var me = this;
		var locMod = "onOnline";
		// var mainPage = me.getMain();
		var page = null;
		try {

		} catch (ex) {

		}
	},
	checkConnection : function() {
		var me = this;
		var locMod = "checkConnection";
		me.debugHandler(locMod,"info",locMod);
		try {
			if (me._deviceOS == "Android" || me._deviceOS == "iOS") {
				var networkState = navigator.connection.type;

				var states = {};

				if (networkState == Connection.NONE) {
					me._connection = 'No network';
				} else {
					states[Connection.UNKNOWN] = 'Unknown connection';
					states[Connection.ETHERNET] = 'Ethernet';
					states[Connection.WIFI] = 'WiFi';
					states[Connection.CELL_2G] = 'Cell 2G';
					states[Connection.CELL_3G] = 'Cell 3G';
					states[Connection.CELL_4G] = 'Cell 4G';
					states[Connection.CELL] = 'Cell generic';

				}
				me._connection = states[networkState];

			} else {
				me._connection = "Default";
			}
			this.debugHandler(locMod, "info", "Connection Establish: ",
					me._connection + "...");

		} catch (ex) {
			me._connection = 'Unknown connection';
			me.errHandler(ex, locMod);
		}
	},
	onOrientationchange : function(viewport, orientation, width, height) {
		var me = this;
		var locMod = "onOrientationchange";
		try {

		} catch (ex) {

		}
	},
	onErrorPage : function(locMod, err) {
		var me = this;
		me.errHandler(err, locMod);
	},
	onErrorData : function(locMod, err) {
		var me = this;
		me.errDataHandler(err, locMod);
	},
	onInitData : function(locMod) {
		var me = this;
		me.debugHandler(locMod, 'info', 'remote load ', '...');
	},
	updSysData : function(field, data) {
		var locMod = "updSysData";
		var me = this;
		try {

			me.debugHandler(locMod, "warn", "localSystemStore Change", field
							+ ":" + data);
			var record = me._localSystemSettingStore.findRecord('sys_id', 1);
			record.set(field, data);
			record.save();
			me._localSystemSettingStore.sync();
		} catch (ex) {
			me.errHandler(ex, locMod);
		}
	},
	checkSetting : function(callback){
		var me = this;
		var locMod = this.getItemId()+".checkSetting";
		//me.dh(locMod,'debug','Setup','...');
		app.dh('Start','...',locMod);
		try{
			var blnFlag = false;
			me._localSystemSettingStore = Ext.getStore("localSystemSettingStore");
			if (!me._localSystemSettingStore) {
				me.debugHandler(locMod,"error","No Setting File",false);
				callback(false);
			}else{
				me._localSystemSettingStore.load({
					scope : me,
					callback : function(records, operation, success) {
						console.error("Setting File?"+records.length);
						if (records.length>0) {
							blnFlag=true;
							var record = records[0];
							try{
								var sound = record.get("sound");
								var soundFlag = false;
								if (sound == 1) {
									soundFlag = true;
								}
								me.initSystemConfig(
									record.data.title,
									record.data.members,
									record.data.locale,
									record.data.ticker_interval,
									soundFlag,
									record.data.notice,
									record.data.color_true,
									record.data.color_false,
									record.data.email,
									record.data.phone,
									record.data.screen_mode,
									record.data.theme,
									record.data.company,
									record.data.company_id,
									record.data.login_flag,
									record.data.login_remember,
									record.data.last_clientid,
									record.data.company_name,
									record.data.user);
									
								system.setLocalSystemSettingStore(me._localSystemSettingStore);
								system.setDeviceOS(me._deviceOS);
								system.setCompanyId(record.get("company_id"));
								system.setIsLogin(record.get("login_flag"));
								system.setRemember(record.get("login_remember"));
								system.setLastId(record.get('last_clientid'));
								system.setCompanyName(record.get("company_name"));
								system.setUser(record.get("user"));
								system.setFullname(record.get("fullname"));
								system.setGroup(record.get("group"));
								me._lang = record.get('locale');
								me._screenMode = record.data.screen_mode;
							
								console.error("company_name:"+system.getCompanyName());
							}catch(ex){
								console.error(ex);
								me.errHandler(ex,locMod);
							}				
						}
						if (callback) {
							callback(blnFlag);
						}
					}
				});
			}
		}catch(ex){
			app.eh(ex,locMod);
		}
	},
	initData : function() {
		var locMod = "initData";
		var me = this;
		app.dh('Start','...',locMod);
		try {
			me._countNav = 0;
			me.debugHandler(locMod, "warn", "Load Initial Data", "...");
			me.load_faq(false);
			me.load_priority(false);
			me.load_config(true);
			me.load_all_client(false);
			me.load_event(false);
			if (system.getIsLogin()) {
				me.load_client(system.getLastId(),false);
				me.load_topic(false);
				me.load_notification(false);
				me.load_product(system.getLastId(),false);
				me.getTicketByClient(system.getLastId(),false);
				
			}
		} catch (ex) {
			this.errHandler(ex, locMod);

		}
	},
	doInitOneSignal : function() {
		var me = this;
		var locMod = "controller.doInitOneSignal";
		
		me.dh(locMod,'debug','Start',me._deviceOS);
		if (me._deviceOS=="Default") {
			var userStr = system.getUser();
		    var OneSignal = OneSignal || [];
		    console.error(OneSignal);
		    OneSignal.push(["init", {
		      appId: "1b1b57f7-fdae-47c1-a9e5-453b9992a2ba",
		      //subdomainName: 'wtpropertycheck.onesignal.com',   
		      notifyButton: {
		      	  	showCredit: false, // Hide the OneSignal logo
		      	  	size: 'medium', // One of 'small', 'medium', or 'large'
			    	theme: 'inverse', // One of 'default' (red-white) or 'inverse" (white-red)
				    position: 'bottom-right', // Either 'bottom-left' or 'bottom-right'
				    offset: {
				      bottom: '0px',
				      left: '0px', // Only applied if bottom-left
				      right: '0px' // Only applied if bottom-right
				    },
				    text: {
					      'tip.state.unsubscribed': 'Subscribe to WtPropertyCheck notifications',
					      'tip.state.subscribed': "You're subscribed to WtPropertyCheck notifications",
					      'tip.state.blocked': "You've blocked notifications",
					      'message.prenotify': 'Click to subscribe to notifications',
					      'message.action.subscribed': "Thanks for subscribing!",
					      'message.action.resubscribed': "You're subscribed to WtPropertyCheck notifications",
					      'message.action.unsubscribed': "You won't receive notifications again",
					      'dialog.main.title': 'WtPropertyCheck Notifications Subscription',
					      'dialog.main.button.subscribe': 'SUBSCRIBE',
					      'dialog.main.button.unsubscribe': 'UNSUBSCRIBE',
					      'dialog.blocked.title': 'Unblock Notifications',
					      'dialog.blocked.message': "Follow these instructions to allow notifications:"
					},
		          	enable: true // Set to false to hide
		      }
		    }]);
		    OneSignal.push(function() {
		   	  OneSignal.on('subscriptionChange', function(isSubscribed) {
		   	    if (isSubscribed) {
		   	      OneSignal.getUserId( function(userId) {
		     	       OneSignal.push(["sendTags", {user: userStr, role: "CLIENT", company: system.getCompanyName()}]);
		   	      });
		   	    }
		   	  });
		   	});
		}
	},
	load_dailytimetable : function() {
		var me = this;
		var locMod = "controller-load_dailytimetable";
		try {
			me._localDailyTimetableStore = Ext
					.getStore('localDailyTimetableStore');
			me.load_store("localDailyTimetableStore", function(records,
					operation, success) {
				me._localSubjectTimetableStore = Ext
						.getStore('localSubjectTimetableStore');
				me._localSubjectTimetableStore.removeAll(false);
				me._localSubjectTimetableStore.sync();
				for (var i = 0; i < records.length; i++) {
					var record = records[i];
					var newItem = record.copy();
					me._localSubjectTimetableStore.add(newItem);
					// console.error(record);

				}
				me._localSubjectTimetableStore.sync();
				me._localSubjectTimetableStore.load();
				me.count_store('localSubjectTimetableStore');
					// me.load_subjecttimetable();
				});
		} catch (ex) {
			me.errHandler(ex, locMod);
		}
	},
	onPathMenuOpen : function(menu, menuButton) {
		this.playSound('path-menu-open');
	},
	onPathMenuClose : function(menu, menuButton) {
		this.playSound('path-menu-close');
	},
	onPathMenuItemTap : function(menu, menuItem) {
		var me = this;
		var locMod = "onPathMenuItemTap";
		// //console.error(menuItem);
		// console.log(menuItem.cardIndex);
		console.log(menuItem.getItemId());
		switch (menuItem.getItemId()) {
			case "backItem" :
				// var curView = mhelpdesk.app.getCurrentViewPage()
				// console.log(curView);
				// me.getMain().pop();
				// curView.pop();
				me.popPage();
				break
			case "refreshItem" :
				me.clearCache();
				
				break
			case "searchItem" :
				var mainPage = me.getMainpage();
				mainPage.setActiveItem(3);
				break;
			case "homeItem" :
				me.gotoHome();
				break;
			case "menuItem" :
				//me.debugHandler(locMod,"info","menuItem Click");
				app.dh("Menu Item","Click",locMod);
				var me = this;
				if (this._menuOpen) {
					Ext.Viewport.hideAllMenus();
					this._menuOpen = false;

				} else {
					this._menuOpen = true;
					Ext.Viewport.setMenu(me._menu, {
								side : 'left',
								reveal : true
							});
					Ext.Viewport.toggleMenu("left");
				}
				break;
			default :
				console.log("default");
				break;
		}
	},
	gotoHome : function() {
		var me = this;
		var locMod = 'gotoHome';
		try {
			me._currentPage = null;
			me.showMyMasked("Kembali ke Laman Utama", true);
			var mainpage;
			
			if (system.getScreenMode()==2){
				mainpage = me.getGuardPage();
			}else{
				mainpage = me.getMainPage2();
			}
			var homepage = me.getHomepage();
			me.popPage(me._countNav);
			me._countNav = 0;
			//mainpage.setActiveItem(0);
		} catch (ex) {
			me.errHandler(ex, locMod);
			me.hideMyMasked();
		}
	},
	createPathMenu : function() {
		var locMod = "createPathMenu";
		var me = this;
		try {
			me._pathMenuMain = Ext.create('Ext.ux.PathMenu', {
						itemId : 'pathMenuMain',
						bottom : 5,
						left : 5,
						items : [{
									xtype : 'button',
									itemId : 'backItem',
									iconCls : "fa-undo",
									disabled : true,
									cardIndex : 0
								}, {
									itemId : 'refreshItem',
									iconCls : 'fa-refresh',
									cardIndex : 1
								}, {
									itemId : 'searchItem',
									iconCls : 'fa-search',
									cardIndex : 2
								}, {
									itemId : 'homeItem',
									iconCls : 'fa-home',
									cardIndex : 3
								}, {
									itemId : 'menuItem',
									iconCls : 'fa-bars',
									cardIndex : 4
								}]
					});
			var items = Ext.ComponentQuery.query('button[pathButtonType=menuitem]');
			me._backItem = items[0];
		} catch (ex) {
			me._debugModule = locMod;
			me.errHandler(ex);
		}
	},
	getSysDate : function(rDate){
		// str1 format should be dd/mm/yyyy. Separator can be anything e.g. / or -. It wont effect
		try {
			var aryDate = rDate.split('-');
			var dt1   = parseInt(aryDate[0]);
			var mon1  = parseInt(aryDate[1]);
			var yr1   = parseInt(aryDate[2]);
			var date1 = new Date(yr1, mon1-1, dt1);
			return date1;
		}catch(ex){
			return null;	
		}
	},
	getFormatDate : function(rDate) {
		var dDate = rDate;
		var mon = dDate.getMonth() + 1;;
		if (mon < 10) {
			mon = "0" + mon;
		}
		var day = dDate.getDate();
		if (day < 10) {
			day = "0" + day;
		}
		var returnDate = day + "-" + mon + "-" + dDate.getFullYear();// format('Y-locMod-d');
		return returnDate;
	},
	getFormatTime : function(rTime) {
		var aryTime = rTime.split(':');
		var h = aryTime[0];
		var m = aryTime[1];
		if (h < 10) {
			h = "0" + h;
		}
		return h + ":" + m;
	},
	getTodayDate : function() {
		var locMod = "getTodayDate";
		var dDate = new Date();
		var mon = dDate.getMonth() + 1;

		if (mon < 10) {
			mon = "0" + mon;
		}
		var day = dDate.getDate();
		if (day < 10) {
			day = "0" + day;
		}
		var todayDate = day + "-" + mon + "-" + dDate.getFullYear();// format('Y-m-d');
		return todayDate;

	},
	getTodayDateTime : function() {
		var locMod = "getTodayDateTime";
		var dDate = new Date();
		var mon = dDate.getMonth() + 1;
		if (mon < 10) {
			mon = "0" + mon;
		}
		var todayDate = dDate.getFullYear() + "-" + mon + "-" + dDate.getDate()
				+ " " + dDate.getHours() + ":" + dDate.getMinutes() + ":"
				+ dDate.getSeconds();
		return todayDate;
	},
	getTime : function(dDate) {
		var dTime = new Date().getTime();
		return dTime;
	},

	getMinutes : function(rTime) {
		var aryTime = rTime.split(':');
		var h = parseInt(aryTime[0]);
		var m = parseInt(aryTime[1]);

		var minute = h * 60;
		minute = minute + m;
		return minute;
	},
	getDelayTime : function(prev) {
		var curr = new Date(); // 9:00 AM
		var diff = curr - prev;
		return diff;
	},
	initSystemConfig : function(title,members,lang,ticker_interval,soundFlag,notice,color_true,color_false,email,phone,screenMode,theme,company,companyId) {
		var me = this;
		var locMod = "initSystemConfig";
		try{
			system.setTitle(title);
			system.setMembers(members);
			system.setLanguage(lang);
			
			system.setTickerInterval(ticker_interval);
			system.setSound(soundFlag);
			system.setNotice(notice);
			system.setColorTrue(color_true);
			system.setColorFalse(color_false);
			system.setEmail(email);
			system.setPhone(phone);
			system.setScreenMode(screenMode);
			system.setTheme(theme);
			if (!theme) system.setTheme('app.css');
			system.setCompanyName(company);
			system.setCompany(companyId);
			system.setCompanyId(companyId);

		}catch(ex){
			me.errHandler(ex, locMod);
		}
	},
	setupData : function(callback) {
		var me = this;
		var locMod = "controller-setupData";
		app.dh('SETUPDATA','...',locMod);
		try {
			var title = system.getTitle();
			var email = system.getEmail();
			var members = system.getMembers();
			var phone = system.getPhone();
			var company = system.getCompany();
			var companyId = system.getCompanyId();
			var companyName = system.getCompanyName();
			var user = system.getUser();
			var fullname = system.getFullname();
			//console.error("companyId:"+companyId);
			var dataSetting = Ext.create('mhelpdesk.model.SystemSetting', {
						"sys_id" 		: 1,
						"title" 		: (title) ? title : "WT Property Mobile",
						"members" 		: (members) ? members : "Support Team",
						"locale" 		: "en",
						"ticker_interval" : 350,
						"sound" 		: 0,
						"notice" 		: "WT Property Mobile Application ... ",
						"color_true" 	: "green",
						"color_false" 	: "red",
						"email" 		: (email) ? email : "support@wbiztech.com",
						"phone" 		: (phone) ? phone : "+6012-11111111",
						"screen_mode" 	: 0,
						"company" 		: (company) ? company : "Wbiztech Sdn Bhd",
						"company_id"	: (companyId) ? companyId : me._def_company_id,
						"company_name"	: (companyName) ? companyName : "WT PROPERTY",
						"user"			: (user) ? user : 'public@localhost.com',
						"fullname"		: (fullname) ? fullname : '',
						"login_flag"	: 0,
						"login_remember": 0,
						"last_clientid"	: 0,
						"theme" 		: "app.css"
						
					});
			me._localSystemSettingStore = Ext.getStore('localSystemSettingStore');
			me.clearStore(me._localSystemSettingStore);
			me._localSystemSettingStore.add(dataSetting);
			me._localSystemSettingStore.sync();
			me._localSystemSettingStore.load({
				callback : function(records, operation, success) {
					if (records.length>0) {
						blnFlag=true;
						var record = records[0];
						try{
							var sound = record.get("sound");
							var soundFlag = false;
							if (sound == 1) {
								soundFlag = true;
							}
							console.error("HERE company_id:"+record.get("company_id"));
							me.initSystemConfig(
								record.data.title,
								record.data.members,
								record.data.locale,
								record.data.ticker_interval,
								soundFlag,
								record.data.notice,
								record.data.color_true,
								record.data.color_false,
								record.data.email,
								record.data.phone,
								record.data.screen_mode,
								record.data.theme,
								record.data.company,
								record.data.company_id,
								record.data.login_flag,
								record.data.login_remember,
								record.data.last_clientid,
								record.data.company_name,
								record.data.user);
								
							system.setLocalSystemSettingStore(me._localSystemSettingStore);
							system.setDeviceOS(me._deviceOS);
							system.setCompanyId(record.get("company_id"));
							system.setIsLogin(record.get("login_flag"));
							system.setRemember(record.get("login_remember"));
							system.setLastId(record.get('last_clientid'));
							system.setCompanyName(record.get("company_name"));
							system.setUser(record.get("user"));
							me._lang = record.get("locale");
							me._screenMode = record.data.screen_mode;
						
						}catch(ex){
							me.errHandler(ex,locMod);
						}
						
					}
					if (callback) {
						callback(records, operation, success);	
					}

				}
			});

		} catch (ex) {
			me.errHandler(ex, locMod);
			callback(null,null,false);
		}
	},
	updSysSetting : function(field, data) {
		var locMod = "controller-updSysSetting";
		var me = this;
		try {

			me.debugHandler(locMod, "warn", "localSystemStore Change", field
							+ ":" + data);
			var record = me._localSystemSettingStore.findRecord('sys_id', 1);
			if (record) {
				record.set(field, data);
				record.save();
				me._localSystemSettingStore.sync();
			}else{
				app.dh('localSystemStore','No Record...',locMod,'warn');	
			}
			
		} catch (ex) {
			me.errHandler(ex, locMod);
		}
	},
	count_store : function(storeId) {
		var me = this;
		var localStore = Ext.getStore(storeId)
		var locMod = "count_store-" + storeId;

		var retCount = 0;
		try {
			if (localStore) {
				retCount = localStore.getTotalCount();
			}
		} catch (ex) {
			me.errHandler(ex, locMod);
		}
		me.debugHandler(locMod, "info", "Count " + storeId, retCount);
		return retCount;
	},
	filter_store : function(storeId, field, value) {
		var localStore = Ext.getStore(storeId)
		var blnFlag = false;
		if (localStore) {
			localStore.clearFilter();

			var thisRegEx = new RegExp(value, "i");
			try {
				console.log(thisRegEx);
				localStore.filterBy(function(record) {
							// console.info("search field change " + field + " "
							// + record.get(field));
							//
							if (thisRegEx.test(record.get(field))) {
								blnFlag = true;
								return true;
							};

							return false;
						});
			} catch (ex) {
				me.eh(ex,'filter_store');
			}
		}
		return blnFlag;
	},
	find_subject : function(date, code) {
		var localStore = Ext.getStore("localSubjectTimetableStore");
		var blnFlag = false;
		if (localStore) {
			localStore.clearFilter();

			var queryString = date + "|" + code;
			var thisRegEx = new RegExp(queryString, "i");
			try {
				console.log(thisRegEx);
				localStore.filterBy(function(record) {

							if (record.get('fdate') == date
									&& record.get('code') == code) {
								blnFlag = true;
								return true;
							}
							return false;
						});
			} catch (ex) {
				me.eh(ex,'find_subject');
			}
		}
		return blnFlag;
	},
	getTotal : function(records) {
		var locMod = "getTotal";
		try {
			return records.length;
			// if (records._resultSet === undefined) {
			// // if (!records) {
			// // console.log(records);
			// // return records._resultSet._count;
			// return records.length;
			// } else {
			//
			// return records._resultSet._count;
			// }
		} catch (ex) {
			// return 0;
			return records._resultSet._count;
		}
	},
	offlineMode : function(localStore) {
		var me = this;
		var locMod = 'offlineMode';
		var records, page;
		try {
//			if (me._isLogin) {
//				page = me.getMain();
//
//			} else {
//				page = me.getLoginpage();
//			}
			page = me.getMain();
			records = localStore.getData();
			page.setTopText("error", 'OFFLINE!', false, true, 30000);
			me.debugHandler(locMod, "warn", "OFFLINE! ", localStore
							.getStoreId()
							+ "(" + localStore.getTotalCount() + ")");
		} catch (ex) {
			me.errorHandler(ex, locMod);
		}
		return records;

	},
	checkRefresh : function(refresh, localStore) {
		var me = this;
		var locMod = 'checkRefresh';
		try {
			var takeRemote = false;
			var totalLocal = localStore.getTotalCount();
			if (refresh) {
				takeRemote = refresh;
			} else {
				if (!totalLocal) {
					totalLocal = 0;
				}
				if (totalLocal < 1) {
					takeRemote = true;
				}
			}
			return takeRemote;
		} catch (ex) {
			me.errHandler(ex, locMod);
			return true;
		}
	},
	filterTicketById : function(field, fieldValue) {
		var me = this;
		var locMod = this.getItemId()+'.filterTicketById';
		// var queryString = month + "-" + year;
		try {
			var retRecord=null;
			var filterFlag=false; 
			var thisRegEx = new RegExp(fieldValue, "i");
			console.log(thisRegEx);
			var localStore = Ext.getStore('localTicketStore');
			localStore.clearFilter();
			localStore.filterBy(function(record) {
				
				filterFlag = thisRegEx.test(record.get(field));

				if (filterFlag) {
					retRecord = record;
				}

			});
			localStore.clearFilter();
			return retRecord;
		} catch (ex) {
			me.errHandler(ex, locMod);
		}
	},
	getEmail : function(filter, callback) {
		var me = this;
		var locMod = "getEmail";
		this.debugHandler(locMod, "info", locMod, "...");
		try {
			var params = {
				type : 'single',
				table : 'rz_email',
				filter : filter,
				sort : 'email_id',
				direction : "ASC"
			};
			var remoteStore = Ext.getStore('remoteEmailStore');
			var localStore = Ext.getStore('localEmailStore');
			me._localEmailStore = localStore;
			localStore.load();
		
			me.remoteStoreCall(locMod,params,remoteStore,localStore,true,callback);
		} catch (ex) {
			// //console.error("ERR load_school:" + ex);
			me.errHandler(ex, locMod);
			callback(null,null,false);
		}
	},
	getTicketByEmail : function(email, refresh, callback) {
		var me = this;
		var locMod = "getTicketByEmail";
		this.debugHandler(locMod, "info", locMod, "...");
		try {
			var strFilter = "ticket.email='"+email+"'";
			
			var params = {
				type : 'single',
				table : 'rz_ticket',
				filter : strFilter,
				sort: '[{"property":"ticket.created","direction":"DESC"}]'
			};
			var remoteStore = Ext.getStore('remoteTicketStore');
			var localStore = Ext.getStore('localTicketStore');
			me._localTicketStore = localStore;
			localStore.load();
		
			if (!me.checkRefresh(refresh, localStore)) {
				me.localStoreCall(locMod,localStore,callback);
			} else {
				me.remoteStoreCall(locMod,params,remoteStore,localStore,refresh,callback);
			}
			
		} catch (ex) {
			me.errHandler(ex, locMod);
		}
	},
	getTicketById : function(id, refresh, callback) {
		var me = this;
		var locMod = "getTicketById";
		this.debugHandler(locMod, "info", locMod, "...");
		try {
			var strFilter = "ticket.ticket_id="+id;
			
			var params = {
				type : 'single',
				table : 'rz_ticket',
				filter : strFilter,
				sort: '[{"property":"ticket.created","direction":"DESC"}]'
			};
			var remoteStore = Ext.getStore('remoteTicketStore');
			var localStore = Ext.getStore('localTicketStore');
			me._localTicketStore = localStore;
			localStore.load();
			if (!me.checkRefresh(refresh, localStore)) {
				me.localStoreCall(locMod,localStore,callback);
			} else {
				me.remoteStoreCall(locMod,params,remoteStore,localStore,refresh,callback);
			}
			
		} catch (ex) {
			me.errHandler(ex, locMod);
		}
	},
	getTicketByClient : function(id, refresh, callback) {
		var me = this;
		var locMod = "getTicketByClient";
		app.dh("Start", "...", locMod);
		try {
			var strFilter = "ticket.client_id="+id+' AND ticket.topic_id<>2';
			
			var params = {
				type : 'single',
				table : 'rz_ticket',
				filter : strFilter,
				sort: '[{"property":"ticket.created","direction":"DESC"}]'
			};
			var remoteStore = Ext.getStore('remoteTicketStore');
			var localStore = Ext.getStore('localTicketStore');
			me._localTicketStore = localStore;
			localStore.load();
			
			if (!me.checkRefresh(refresh, localStore)) {
				me.localStoreCall(locMod,localStore,callback);
			} else {
				me.remoteStoreCall(locMod,params,remoteStore,localStore,refresh,callback);
			}
			
		} catch (ex) {
			me.errHandler(ex, locMod);
		}
	},
	getTicketByFilter : function(strFilter, refresh, callback) {
		var me = this;
		var locMod = "getTicketByFilter";
		app.dh("Start", "...", locMod);
		try {
			//var strFilter = "ticket.client_id="+id;
			
			var params = {
				type : 'single',
				table : 'rz_ticket',
				filter : strFilter,
				sort: '[{"property":"ticket.created","direction":"DESC"}]'
			};
			var remoteStore = Ext.getStore('remoteTicketStore');
			var localStore = Ext.getStore('localTicketStore');
			me._localTicketStore = localStore;
			localStore.load();
			
			if (!me.checkRefresh(refresh, localStore)) {
				me.localStoreCall(locMod,localStore,callback);
			} else {
				me.remoteStoreCall(locMod,params,remoteStore,localStore,refresh,callback);
			}
			
		} catch (ex) {
			me.errHandler(ex, locMod);
		}
	},
	getTicketBySOS : function(filter, refresh, callback) {
		var me = this;
		var locMod = "getTicketBySOS";
		app.dh("Start",filter,locMod);
		try {
			var strFilter = "ticket.topic_id=2";
			if (filter) strFilter+= " AND "+filter;
			app.dh('Filter',strFilter,locMod);
			var params = {
				type : 'single',
				table : 'rz_ticket',
				filter : strFilter,
				sort: '[{"property":"ticket.created","direction":"DESC"}]'
			};
			var remoteStore = Ext.getStore('remoteSosTicketStore');
			var localStore = Ext.getStore('localSosTicketStore');
			me._localSosTicketStore = localStore;
			localStore.load();
			
			if (!me.checkRefresh(refresh, localStore)) {
				me.localStoreCall(locMod,localStore,callback);
			} else {
				me.remoteStoreCall(locMod,params,remoteStore,localStore,refresh,callback);
			}
			
		} catch (ex) {
			me.errHandler(ex, locMod);
		}
	},
	getTicketByVisitor : function(filter, refresh, callback) {
		var me = this;
		var locMod = "getTicketByVisitor";
		app.dh("Start",filter,locMod);
		try {
			var strFilter = "(ticket.topic_id=4 OR ticket.topic_id=5)";
			if (filter) strFilter+= " AND "+filter;
			app.dh('Filter',strFilter,locMod);
			var params = {
				type : 'single',
				table : 'rz_ticket',
				filter : strFilter,
				sort: '[{"property":"ticket.created","direction":"DESC"}]'
			};
			var remoteStore = Ext.getStore('remoteVisitorTicketStore');
			var localStore = Ext.getStore('localVisitorTicketStore');
			me._localVisitorTicketStore = localStore;
			localStore.load();
			
			if (!me.checkRefresh(refresh, localStore)) {
				me.localStoreCall(locMod,localStore,callback);
			} else {
				me.remoteStoreCall(locMod,params,remoteStore,localStore,refresh,callback);
			}
			
		} catch (ex) {
			me.errHandler(ex, locMod);
		}
	},
	getTicketMessage : function(ticket_id, refresh, callback) {
		var me = this;
		var locMod = "getTicketMessage";
		this.debugHandler(locMod, "info", locMod, "...");
		try {
			var params = {
				type : 'single',
				table : 'rz_ticket_message',
				id : ticket_id
			};
			var remoteStore = Ext.getStore('remoteMessageStore');
			var localStore = Ext.getStore('localMessageStore');
			me._localMessageStore = localStore;
			localStore.load();
			if (!me.checkRefresh(refresh, localStore)) {
				me.localStoreCall(locMod,localStore,callback);
			} else {
				me.remoteStoreCall(locMod,params,remoteStore,localStore,refresh,callback);
			}
			
			
		} catch (ex) {
			// //console.error("ERR load_school:" + ex);
			me.errHandler(ex, locMod);
		}
	},
	getClient : function(strFilter, refresh, callback) {
		var me = this;
		var locMod = this.getItemId()+".getClient";
		this.debugHandler(locMod, "info", "LOAD " + locMod, "...");
		try {
			
			var params = {
				type : 'single',
				table : 'rz_clients',
				filter : strFilter,
				sort : 'client_id',
				direction : "ASC"
			};
			var remoteStore = Ext.getStore('remoteClientStore');
			var localStore = Ext.getStore('localClientStore');
			me._localClientStore = localStore;
			localStore.load();
		
			var match;
			if (!me.checkRefresh(refresh, localStore)) {
				me.localStoreCall(locMod,localStore,callback);
			} else {
				me.remoteStoreCall(locMod,params,remoteStore,localStore,refresh,callback);
			}

		} catch (ex) {
			me.errHandler(ex, locMod);
			callback(null,null,false);
		}
	},
	openUserTicket: function(record) {
		var me = this;
		var locMod = "openUserTicket";
		this.debugHandler(locMod, "info", locMod, "...");
		try {
			var ticket_id = record.get('ticket_id');
			var record = me.filterTicketById('ticket_id',ticket_id);
			//console.error(record);
			var page = Ext.create('mhelpdesk.view.ViewTicket');
			if (record) {
				page.setRecord(record);
				me.getTicketMessage(ticket_id, true);
				
				var strHtml = '<div class="ticket_hdr">' 
				+ '<div class="ticket_detail">'
				+ '		<div style="font-weigth:bold;font-size: 1em;text-align: center;">' + locale.getText('Ticket') + ' #'+record.get("ticketID")
				+ ' ('+record.get("status").toUpperCase()+')</div>'
				+ '<span style="font-weigth:bold;font-size: .7em;">' + locale.getText('DateCreate') + ': '+record.get("fcreated")+'<br>'
				+ record.get("name")+ '<br>'
				+ '</span><br>'
				+ '</div>'
				+ '<span style="font-size: .85em;">'+record.get("subject")+'</span>'
				+ '</div>';
				
				var obj = page.down('#hdrSummary');
				obj.setHtml(strHtml);
				
			}
			
			me.pushPage(page);
		} catch (ex) {
			// //console.error("ERR load_school:" + ex);
			me.errHandler(ex, locMod);
		}				
	},
	load_faq : function(refresh, callback) {
		var me = this;
		var locMod = "load_faq";
		this.debugHandler(locMod, "info", "LOAD " + locMod, "...");
		try {
			var strFilter = "isactive=1 AND language='"+system.getLanguage()+"'";
			
			var params = {
				type : 'single',
				fields : 'faq_id, isactive, topic, question, answer, category, language, created, updated',
				table : 'rz_faq',
				filter : strFilter,
				sort: '[{"property":"category","direction":"ASC"}]'
			};
			var remoteStore = Ext.getStore('remoteFaqStore');
			var localStore = Ext.getStore('localFaqStore');
			localStore.load();
			function doProcess(records, operation, success) {
				if (callback) {
					callback(records, operation, success);
				}
			}
			var match;
			if (!me.checkRefresh(refresh, localStore)) {
				me.localStoreCall(locMod,localStore,doProcess);
			} else {
				me.remoteStoreCall(locMod,params,remoteStore,localStore,refresh,doProcess);
			}

		} catch (ex) {
			// //console.error("ERR load_school:" + ex);
			me.errHandler(ex, locMod);
		}
	},
	load_notification : function(refresh, callback) {
		var me = this;
		var locMod = "load_notification";
		this.dh(locMod, "info", "LOAD " + locMod, "...");
		try {
			//var strFilter = "isactive=1 AND language='"+system.getLanguage()+"'";
			var strFilter = "isactive=1 AND company_id="+system.getCompanyId()+
				" AND (sdatetime < DATE(NOW()) AND edatetime > DATE(NOW()))" +
				" AND mesg_type='PUBLIC' OR mesg_type='CLIENT'";
				
			var params = {
				type : 'single',
				//fields : 'faq_id, isactive, topic, question, answer, category, language, created, updated',
				table : 'rz_notification',
				filter : strFilter,
				sort : 'sdate',
				direction : "DESC"
			};
			var remoteStore = Ext.getStore('remoteNotificationStore');
			var localStore = Ext.getStore('localNotificationStore');
			localStore.load();
			function doProcess(records, operation, success) {
				if (callback) {
					callback(records, operation, success);
				}
			}
			var match;
			if (!me.checkRefresh(refresh, localStore)) {
				me.localStoreCall(locMod,localStore,doProcess);
			} else {
				me.remoteStoreCall(locMod,params,remoteStore,localStore,refresh,doProcess);
			}

		} catch (ex) {
			// //console.error("ERR load_school:" + ex);
			me.errHandler(ex, locMod);
		}
	},
	load_event : function(refresh, callback) {
		var me = this;
		var locMod = "load_event";
		this.dh(locMod, "info", "LOAD " + locMod, "...");
		try {
			//var strFilter = "isactive=1"; // AND language='"+system.getLanguage()+"'";
			var strFilter = "isactive=1"
					+ " AND (sdatetime < DATE(NOW()) AND edatetime > DATE(NOW()))";
			var params = {
				type : 'single',
				//fields : 'faq_id, isactive, topic, question, answer, category, language, created, updated',
				table : 'rz_event',
				filter : strFilter,
				sort : 'sdate',
				direction : "DESC"
			};
			var remoteStore = Ext.getStore('remoteEventStore');
			var localStore = Ext.getStore('localEventStore');
			localStore.load();
			function doProcess(records, operation, success) {
				if (callback) {
					callback(records, operation, success);
				}
			}
			var match;
			if (!me.checkRefresh(refresh, localStore)) {
				me.localStoreCall(locMod,localStore,doProcess);
			} else {
				me.remoteStoreCall(locMod,params,remoteStore,localStore,refresh,doProcess);
			}

		} catch (ex) {
			// //console.error("ERR load_school:" + ex);
			me.errHandler(ex, locMod);
		}
	},
	load_config : function(refresh, callback) {
		var me = this;
		var locMod = "load_config";
		this.debugHandler(locMod, "info", "LOAD " + locMod, "...");
		try {
			var strFilter = "id=1";
			
			var params = {
				type : 'single',
				table : 'rz_config',
				filter : strFilter,
				sort : 'id',
				direction : "ASC"
			};
			var remoteStore = Ext.getStore('remoteConfigStore');
			var localStore = Ext.getStore('localConfigStore');
			me._localConfigStore = localStore;
			localStore.load();
		
			var match;
			if (!me.checkRefresh(refresh, localStore)) {
				me.localStoreCall(locMod,localStore,callback);
			} else {
				me.remoteStoreCall(locMod,params,remoteStore,localStore,refresh,function(records, operation, success){
					var recordConfig = records[0];
					var email_id = 1;
					var title = "Mobile Helpdesk";
					//var companyId = 1;
					if (recordConfig) {
						email_id =  recordConfig.get('default_email_id');	
						title = recordConfig.get('helpdesk_title');						
					}
					me.getEmail('email_id='+email_id,function(records, operation, success){
						var recordEmail = null;	
						if (success) {
							me.dh(locMod,"info","Refresh System Config",title);
							recordEmail = records[0];
							system.setTitle(title);			
							me.updSysSetting("title",title);
							
							system.setEmail(recordEmail.get('email'));
							me.updSysSetting("email",recordEmail.get('email'));
						
							system.setMembers(recordEmail.get('name'));
							
							system.setPhone(recordEmail.get('phone'));
							me.updSysSetting("phone",recordEmail.get('phone'));
							
							system.setCompany(title);
							
							//system.setCompanyId(companyId);
							//console.error(companyId);
							me.dh(locMod,'info','Update done',"...");
							
							
						}
						if (callback) { callback(records,operation,success); }
					});
				});
			}

		} catch (ex) {
			me.errHandler(ex, locMod);
			callback(null,null,false);
		}
	},
	load_page : function(company_id, refresh, callback) {
		var me = this;
		var locMod = "load_page";
		this.debugHandler(locMod, "info", "LOAD " + locMod, "...");
		try {
			var strFilter = "company_id="+company_id;
			
			var params = {
				type : 'single',
				table : 'rz_page',
				filter : strFilter,
				sort : 'page_id',
				direction : "ASC"
			};
			var remoteStore = Ext.getStore('remotePageStore');
			var localStore = Ext.getStore('localPageStore');
			me._localPageStore = localStore;
			localStore.load();
		
			var match;
			if (!me.checkRefresh(refresh, localStore)) {
				me.localStoreCall(locMod,localStore,callback);
			} else {
				me.remoteStoreCall(locMod,params,remoteStore,localStore,refresh,callback);
			}

		} catch (ex) {
			me.errHandler(ex, locMod);
			callback(null,null,false);
		}
	},
	load_pagedetail : function(page_id,refresh, callback) {
		var me = this;
		var locMod = "load_pagedetail";
		this.debugHandler(locMod, "info", "LOAD " + locMod, "...");
		try {
			var strFilter = "page_id="+page_id;		
			var params = {
				type : 'single',
				table : 'rz_page_detail',
				filter : strFilter,
				sort : 'page_detail_id',
				direction : "ASC"
			};
			var remoteStore = Ext.getStore('remotePageDetailStore');
			var localStore = Ext.getStore('localPageDetailStore');
			me._localPageDetailStore = localStore;
			localStore.load();
		
			var match;
			if (!me.checkRefresh(refresh, localStore)) {
				me.localStoreCall(locMod,localStore,callback);
			} else {
				me.remoteStoreCall(locMod,params,remoteStore,localStore,refresh,callback);
			}

		} catch (ex) {
			me.errHandler(ex, locMod);
			callback(null,null,false);
		}
	},
	load_client : function(client_id, refresh, callback) {
		var me = this;
		var locMod = "load_client";
		this.debugHandler(locMod, "info", "LOAD " + locMod, "...");
		try {
			var strFilter = "client_id="+client_id;
			
			var params = {
				type : 'single',
				table : 'rz_clients',
				filter : strFilter,
				sort : 'client_id',
				direction : "ASC"
			};
			var remoteStore = Ext.getStore('remoteClientStore');
			var localStore = Ext.getStore('localClientStore');
			me._localClientStore = localStore;
			localStore.load();
		
			var match;
			if (!me.checkRefresh(refresh, localStore)) {
				me.localStoreCall(locMod,localStore,callback);
			} else {
				me.remoteStoreCall(locMod,params,remoteStore,localStore,refresh,callback);
			}

		} catch (ex) {
			me.errHandler(ex, locMod);
			callback(null,null,false);
		}
	},
	load_all_client : function(refresh, callback) {
		var me = this;
		var locMod = "load_client";
		this.debugHandler(locMod, "info", "LOAD " + locMod, "...");
		try {
			var strFilter = "client.client_isactive=1 AND client.company_id="+system.getCompanyId();
			
			var params = {
				type : 'single',
				table : 'rz_clients',
				filter : strFilter,
				sort : 'client.client_firstname',
				direction : "ASC"
			};
			var remoteStore = Ext.getStore('remoteAllClientStore');
			var localStore = Ext.getStore('localAllClientStore');
			me._localAllClientStore = localStore;
			localStore.load();
		
			var match;
			if (!me.checkRefresh(refresh, localStore)) {
				me.localStoreCall(locMod,localStore,callback);
			} else {
				me.remoteStoreCall(locMod,params,remoteStore,localStore,refresh,callback);
			}

		} catch (ex) {
			me.errHandler(ex, locMod);
			callback(null,null,false);
		}
	},
	search_client : function(filter, refresh, callback) {
		var me = this;
		var locMod = "search_client";
		this.debugHandler(locMod, "info", "LOAD " + locMod, "...");
		try {
			var strFilter = "client_isactive=1";
			if (filter) {
				strFilter = strFilter + " AND "+filter;
			}
			var params = {
				type : 'single',
				table : 'rz_clients',
				filter : strFilter,
				direction : "ASC"
			};
			var remoteStore = Ext.getStore('remoteClientStore');
			var localStore = Ext.getStore('localClientStore');
			me._localClientStore = localStore;
			localStore.load();
		
			function doProcess(records, operation, success) {
				if (callback) {
					callback(records, operation, success);
				}
			}
			var match;
			if (!me.checkRefresh(refresh, localStore)) {
				me.localStoreCall(locMod,localStore,doProcess);
			} else {
				me.remoteStoreCall(locMod,params,remoteStore,localStore,refresh,doProcess);
			}

		} catch (ex) {
			// //console.error("ERR load_school:" + ex);
			me.errHandler(ex, locMod);
		}
	},
	load_topic : function(refresh, callback) {
		var me = this;
		var locMod = "load_topic";
		this.debugHandler(locMod, "info", "LOAD " + locMod, "...");
		try {
			var strFilter = "isactive=1";
			var params = {
				type : 'single',
				table : 'rz_help_topic',
				filter : strFilter,
				direction : "ASC"
			};
			var remoteStore = Ext.getStore('remoteTopicStore');
			var localStore = Ext.getStore('localTopicStore');
			me._localClientStore = localStore;
			localStore.load();
		
			function doProcess(records, operation, success) {
				if (callback) {
					callback(records, operation, success);
				}
			}
			var match;
			if (!me.checkRefresh(refresh, localStore)) {
				me.localStoreCall(locMod,localStore,doProcess);
			} else {
				me.remoteStoreCall(locMod,params,remoteStore,localStore,refresh,doProcess);
			}

		} catch (ex) {
			// //console.error("ERR load_school:" + ex);
			me.errHandler(ex, locMod);
		}
	},
	load_product : function(client_id, refresh, callback) {
		var me = this;
		var locMod = "load_product";
		this.debugHandler(locMod, "info", "LOAD " + locMod, "..."+client_id);
		try {
			var strFilter = "client_id="+client_id;
			
			var params = {
				type : 'single',
				table : 'rz_asset',
				filter : strFilter,
				sort : 'asset_id',
				direction : "ASC"
			};
			var remoteStore = Ext.getStore('remoteProductStore');
			var localStore = Ext.getStore('localProductStore');
			me._localProductStore = localStore;
			localStore.load();
		
			var match;
			if (!me.checkRefresh(refresh, localStore)) {
				me.localStoreCall(locMod,localStore,callback);
			} else {
				me.remoteStoreCall(locMod,params,remoteStore,localStore,refresh,callback);
			}
			
		} catch (ex) {
			me.errHandler(ex, locMod);
			callback(null,null,false);
		}
	},
	load_priority : function(refresh, callback) {
		var me = this;
		var locMod = "load_priority";
		this.debugHandler(locMod, "info", "LOAD " + locMod, "...");
		try {
			var strFilter = "ispublic=1";
			var params = {
				type : 'single',
				table : 'rz_priority',
				filter : strFilter,
				direction : "ASC"
			};
			var remoteStore = Ext.getStore('remotePriorityStore');
			var localStore = Ext.getStore('localPriorityStore');
			me._localClientStore = localStore;
			localStore.load();
		
			function doProcess(records, operation, success) {
				if (callback) {
					callback(records, operation, success);
				}
			}
			var match;
			if (!me.checkRefresh(refresh, localStore)) {
				me.localStoreCall(locMod,localStore,doProcess);
			} else {
				me.remoteStoreCall(locMod,params,remoteStore,localStore,refresh,doProcess);
			}

		} catch (ex) {
			// //console.error("ERR load_school:" + ex);
			me.errHandler(ex, locMod);
		}
	},
	load_store : function(storeId, callback) {
		var me = this;
		var locMod = "load_store";
		var localStore = null;
		// this.debugHandler(locMod, "info", "LOAD " + locMod, "...");
		try {
			localStore = Ext.getStore(storeId);
			localStore.load({
						callback : function(records, operation, success) {
							if (callback) {
								callback(records, operation, success);
							}
							return localStore;
						}
					});
			me.showDebugData(locMod, "LOCAL", localStore, localStore
							.getTotalCount());

		} catch (ex) {
			// console.log("ERROR LOAD: load_ref_category " + ex);
			me.errHandler(ex, locMod);
		}

	},
	localStoreCall : function(locMod, localStore, callback) {
		var me = this;
		try {
			me.showDebugData(locMod, "LOCAL", localStore, localStore.getTotalCount());
			if (callback) {
				var data = localStore.getData();
				if (data) {
					if (data.length > 1) {
						if (callback) callback(data.items, 'local', true);
					}else{	
						var result = [];
						result[0]=data.items[0];
				        if (callback) callback(result, 'local', true);
				        
					}
				}else{
					if (callback) callback(null, 'local', true);
				}
				//console.error(result);
				//callback(result, 'local', true);
			}

		} catch (ex) {
			me.errHandler(ex, locMod);
		}
	},
	remoteStoreCall : function(locMod, parameter, remoteStore, localStore,
			refresh, callback) {
		var me = this;
		var main = me.getMain();
		try {
			remoteStore.load({
						scope : this,
						params : parameter,
						callback : function(records, operation, success) {
							var mode;
							//console.error("remote count:"+records.length);
							try {
								if (!success) {
									mode = 'local';
									records = me.offlineMode(localStore);
									me.showDebugData(locMod, "LOCAL OFFLINE", localStore, localStore.getTotalCount());
								} else {
									mode = 'remote';
									me.syncLocal(success, remoteStore, localStore, records, refresh);
									me.showDebugData(locMod, "REMOTE",
											localStore, records.length);
									if (main) {
										main.setTopText("success", "ONLINE", false, true);
									}
								}

							} catch (ex) {
								me.errHandler(ex, locMod);
							}
							if (callback) callback(records, mode, success);
						}
					});
		} catch (ex) {
			me.errHandler(ex, locMod);
		}
	},
	syncLocal : function(success, remoteStore, localStore, records, refresh) {
		var locMod = "syncLocal";
		var me = this;
		try {

			var takeRemote;
			if (!refresh || refresh==false) {
				takeRemote = false;
			}else{
				takeRemote = true;	
			}
			
			var processFlag = false;
			var localCount = 0;
			localStore.load();
			localCount = localStore.getCount();
			
			if (success) {

				var totalCount = this.getTotal(records);
				if (!(totalCount == localCount) || takeRemote) {
					doRefresh();
					processFlag = true;
					
					me.debugHandler(locMod, "warn", "LOCAL STORE REFRESH", "("
									+ localCount + ":" + totalCount + ")"
									+ localStore.getStoreId());
				} else {
//					me.debugHandler(locMod, "info", "TAKE LOCAL STORE", "("
//									+ localCount + ")"
//									+ localStore.getStoreId());
				}
			} else {
				me.debugHandler(locMod, "warn", "OFFLINE MODE", "("
								+ localCount + ")" + localStore.getStoreId());
			}

			me._updateFlag = false;
			return processFlag;
			
			function doRefresh() {
				localStore.removeAll();
				remoteStore.each(function(item) {
					try {
					      var copiedRecord = item.copy();
					      var newRecord = Ext.Object.merge(copiedRecord.data,{locale:me._lang});
					      localStore.add(copiedRecord);
					      
					} catch (ex) {
						me.errHandler(ex,locMod);
					}
				});
				localStore.sync();	
			}
		} catch (ex) {
			me.errHandler(ex, locMod);
		}
	},
	remove_dailytimetable : function(thisPage) {
		var me = this;
		var locMod = 'controller-remove_dailytimetable';
		var blnFlag = false;
		try {
//			var form = thisPage; // newnotification
//			var fields = form.getValues();
//
//			var date = fields["fdate"];
//			var code = fields["code"];

			if (!me._localDailyTimetableStore) {
				me._localDailyTimetableStore = Ext
						.getStore('localDailyTimetableStore');
			}
			me._localDailyTimetableStore.remove(me._curRecord);
			me._localDailyTimetableStore.sync();
			// me._localDailyTimetableStore.load();
			me.load_dailytimetable();

			blnFlag = true;
		} catch (ex) {
			me.errHandler(ex, locMod);
		}
		return blnFlag;
	},
	save_dailytimetable : function(thisPage) {
		var me = this;
		var locMod = 'controller-save_dailytimetable';
		var blnFlag = false;
		try {
			var form = thisPage; // newnotification
			var fields = form.getValues();
			if (!me._localDailyTimetableStore) {
				me._localDailyTimetableStore = Ext
						.getStore('localDailyTimetableStore');
			}

			var fdate = me.getFormatDate(fields["fdate"]);
			var stime = me.getFormatTime(fields["stime"]);
			var etime = me.getFormatTime(fields["etime"]);

			var dailyTimetable = Ext.create('mhelpdesk.model.DailyTimetable', {
						timetable_id : 1,
						school_id : 0,
						period : 1,
						fdate : fdate,
						stime : stime,
						etime : etime,
						duration : fields["duration"],
						status : 'ACTIVE',
						description : fields["description"],
						subject : fields["subject"],
						code : fields["code"],
						indicator : 'A',
						locale : 'en',
						bg_color : 'green'
					});
			me._localDailyTimetableStore.add(dailyTimetable);
			me._localDailyTimetableStore.sync();
			// me._localDailyTimetableStore.load();

			me.count_store("localDailyTimetableStore");

			// Refresh subject store;
			var subjectTimetable = Ext.create('mhelpdesk.model.SubjectTimetable',
					{
						timetable_id : 1,
						school_id : 0,
						period : 1,
						fdate : fdate,
						stime : stime,
						etime : etime,
						duration : fields["duration"],
						status : 'ACTIVE',
						description : fields["description"],
						subject : fields["subject"],
						code : fields["code"],
						indicator : 'A',
						locale : 'en',
						bg_color : 'green'
					});
			me._localSubjectTimetableStore.add(subjectTimetable);
			me._localSubjectTimetableStore.sync();
			me._localSubjectTimetableStore.load();

			me.count_store("localSubjectTimetableStore");
			blnFlag = true;

		} catch (ex) {
			me.errHandler(ex, locMod);
		}
		return blnFlag;
	},
	save_systemconfig : function(thisPage) {
		var me = this;
		var locMod = 'controller-save_systemconfig';
		var blnFlag = false;
		try {
			var form = thisPage; // newnotification
			var fields = form.getValues();
			if (!me._localSystemSettingStore) {
				me._localSystemSettingStore = Ext.getStore('localSystemSettingStore');
			}
			var soundFlag = 0;
			var screenMode = 0;
			//console.error(fields["sound"]);
			if (fields["sound"]) {
				soundFlag = 1;
			}
//			if (fields["screen_mode"]) {
//				screenMode = 1;
//			}
			screenMode = fields["screen_mode"];
			console.error("ScreenMode:"+screenMode);
			
			var companyId = system.getCompanyId();
			var loginFlag = system.getIsLogin();
			var loginRemember = system.getRemember();
			var lastId = system.getLastId();
			var companyName = system.getCompanyName();
			var user = system.getUser();
			var fullname = system.getFullname();
			var group = system.getGroup();
			if (!system.getIsLogin()) {
				group = 'CLIENT';
			}
			var dataSetting = Ext.create('mhelpdesk.model.SystemSetting', {
						"sys_id" : 1,
						"title" : fields["title"],
						"members" : fields["members"],
						"locale" : fields["locale"],
						"ticker_interval" : fields["ticker_interval"],
						"sound" : soundFlag,
						"notice" : fields["notice"],
						"color_true" : fields["color_true"],
						"color_false" : fields["color_false"],
						"email" : fields["email"],
						"phone" : fields["phone"],
						"screen_mode" : screenMode,
						"theme" : fields["theme"],
						"company" : fields["company"],
						"company_id" : companyId,
						"login_flag" : loginFlag,
						"login_remember" : loginRemember,
						"last_clientid": lastId,
						"company_name" : companyName,
						"user" : user,
						"group" : group,
						"fullname" : fullname
					});
			me.debugHandler(locMod,"info","Saving ", "..");
			me._localSystemSettingStore = Ext.getStore('localSystemSettingStore');
			me.clearStore(me._localSystemSettingStore);
			me._localSystemSettingStore.add(dataSetting);
			me._localSystemSettingStore.sync();
			me._localSystemSettingStore.load({
						callback : function() {
							// me.load_store("localSystemSettingStore");
							system.setTitle(fields["title"]);
							system.setMembers(fields["members"]);
							system.setLanguage(fields["locale"]);
							system.setTickerInterval(fields["ticker_interval"]);
							system.setSound(soundFlag);
							system.setNotice(fields["notice"]);
							system.setColorTrue(fields["color_true"]);
							system.setColorFalse(fields["color_false"]);
							system.setTheme(fields["theme"]);
							system.setCompany(fields["company"]);

						}
					});
			blnFlag = true;
		} catch (ex) {
			me.errHandler(ex, locMod);
		}
		return blnFlag;
	},
	rearrange_dailytimetable : function(fdate) {
		var me = this;
		var locMod = 'controller-rearrange_dailytimetable';
		try {
			var localStore = Ext.getStore("localDailyTimetableStore");
			me.filter_store("localDailyTimetableStore", "fdate", fdate);
			localStore.each(function(item) {
						try {
							var stime = item.get("stime");
							var stime_minutes = me.getMinutes(stime);
//							console.error(item.get("timetable_id") + stime
//									+ ":" + stime_minutes);
						} catch (ex) {
							me.errHandler(ex, locMod);
						}
					});
			// localStore.sync();
		} catch (ex) {
			me.errHandler(ex, locMod)
		}
	},
	clearStore : function(store) {
		store.load();
		store.getProxy().clear();
		store.data.clear();
		store.sync();
	},
	init : function(app) {
		var me = this;
		var locMod = "init";
		try {
			app.on([{
						event : 'globalevent',
						fn : this.onGlobalevent,
						scope : this
					}, {
						event : 'deviceready',
						fn : this.onDeviceready,
						scope : this
					}, {
						event : 'backbutton',
						fn : this.onBackbutton,
						scope : this
					}, {
						event : 'offline',
						fn : this.onOffline,
						scope : this
					}, {
						event : 'online',
						fn : this.onOnline,
						scope : this
					}, {
						event : 'checkConnection',
						fn : this.checkConnection,
						scope : this
					}, {
						event : 'orientationchange',
						fn : this.onOrientationchange,
						scope : this
					}, {
						event : 'ErrorPage',
						fn : this.onErrorPage,
						scope : this
					}, {
						event : 'errorData',
						fn : this.onErrorData,
						scope : this
					}, {
						event : 'initData',
						fn : this.onInitData,
						scope : this
					}, {
						event : 'debugMsg',
						fn : this.debugHandler,
						scope : this
					}]);
		} catch (ex) {
			me._debugModule = locMod;
			me.errHandler(ex);
		}
	},
	
	findRecord: function(store, search, value) {
		var record = store.findRecord(search, value);
		//store.clearFilter();
		if (record) {
			return record;
		}else{
			return null;
		}
	},
	eh: function(err, locMod) {
		this.errHandler(err, locMod);
	},
	errHandler : function(err, locMod) {
		var me = this;
		try {
			me.hideMyMasked();
			app.eh(err,locMod);
//			// me.showToast(locale.getText('msgTransFail'),3)
//			var page = null;
//			page = me.getMain();
//
//			if (locMod) {
//				me._debugModule = locMod;
//			}
//			if (me._isDebug) {
//				page.setBottomText("Error " + me._debugModule + ":" + err,
//						false, true);
//			}
			//console.error(me._debugModule + " ERROR:" + err);
			// console.error("Error " + ":" + err);

		} catch (ex) {
		}
	},
	dh: function(module, msgtype, title, msg, setflag) {
		this.debugHandler(module, msgtype, title, msg, setflag);
	},
	debugHandler : function(module, msgtype, title, msg, setflag) {
		var me = this;
		var locMod = "debugHandler";
		try {
			app.dh(title,msg,module,msgtype);
//			me._debugLine += 1;
//			var strInfoMsg = "#" + me._debugLine + " ";
//			var strContent = "";
//			if (module) {
//				strContent += "[" + module + "]: ";
//			}
//			if (title) {
//				strContent += "" + title;
//			}
//			if (msg) {
//				strContent += "-" + msg;
//			}else if (msg==0||msg==false) {
//				strContent += "-" + msg;
//			}
//
//			if (msgtype == "error") {
//				//console.error(strInfoMsg + strContent);
//			} else if (msgtype == "log") {
//				console.log(strContent);
//			} else if (msgtype == "warn") {
//				console.warn(strInfoMsg + strContent);
//			} else {
//				// info
//				console.info(strInfoMsg + strContent);
//			}
		} catch (ex) {
		}
	},
	errDataHandler : function(err, locMod) {
		var me = this;
		try {
			me.hideMyMasked();
			var page = null;
			page = me.getMain();

			if (locMod) {
				me._debugModule = locMod;
			}
			if (me._isDebug) {
				page.setBottomText("Error " + me._debugModule + ":" + err,
						false, true);
			}
			//console.error("Error " + me._debugModule + ":" + err);

		} catch (ex) {
		}
	},
	changeCSS: function(cssFile, oldlink) {
		var me = this;
		var locMod = "changeCSS";
		me.debugHandler(locMod,"info",locMod);
         //var oldlink = document.getElementsByTagName("link").item(cssLinkIndex);

        var newlink = document.createElement("link");
        newlink.setAttribute("rel", "stylesheet");
        newlink.setAttribute("type", "text/css");
            newlink.setAttribute("href", cssFile);

        if (oldlink) {
        	document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
        }else{
        	document.getElementsByTagName("head").item(0).appendChild(newlink); 
        }
    },
    currentCSS : function(curCSS) {
    	var me = this;
		var locMod = "currentCSS";
		me.debugHandler(locMod,"info","Start",curCSS);
		var link=null;
		try {
			var oldlinks = document.getElementsByTagName("link");
			
			for (var i = 0; i < oldlinks.length; i++) {
				var oldLink = oldlinks.item(i).href;
				if (oldLink.indexOf(curCSS) > -1) {
					link=oldlinks.item(i);
					//console.error(oldLink);
				}
			}
		}catch(ex){
			this.errHandler(ex, locMod);
		}
		return link;
    },
    clearCache : function() {
		console.log('ClearRefresh');
		var me = this;
		var mainPage = me.getMain();
		
		me.showMyMasked(locale.getText('waitRefresh'), false);
			me.load_faq(true);
			me.load_topic(true);
			me.load_priority(true);
			me.load_config(true);
			me.load_event(true);
			me.load_notification(true);
			me.load_all_client(true);
		me.doDelay(5000, function() {
			// mainPage.setMasked(false);
			me.showToast(locale.getText('waitRefresh'), 3);
			window.location.reload();
		});
    }
});
