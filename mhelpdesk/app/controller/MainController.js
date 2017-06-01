system=mhelpdesk.view.System;
locale=mhelpdesk.view.Locale;
Ext.define('mhelpdesk.controller.MainController', {
	extend : 'Ext.app.Controller',

	requires : [],
	_debugModule : 'Main',
	_debugLine : 0,
	_screenMode : 0,
	_deviceOS : 'Default',
	_browser : 'Default',
	_deviceType : 'Default',
	_connection : 'Default',
	_build : '0.0',
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
	config : {
		refs : {
			main : 'main',
			navBar: 'main #navbar',
			//navBar : 'main #navbar',
			mainpage : 'mainpage',
			homepage : 'homepage',
			timetable : 'timetable',
			timetableNew : 'timetableNew',
			timetableList : 'timetableList',
			systemConfig : 'systemConfig',
			fileUpload : 'fileUpload',
			search : 'search',
			faqList : 'faqList',
			ticket : 'ticket',
			status : 'status',
			ticketList : 'ticketList',
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
			fileBtnPostMessage : 'postMessage #fileBtn',
			fileBtnTicket : 'ticket #fileBtnTicket'
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
			'button' : {
				tap: function(btn, e, eOpts) {
					//console.error("button tap");
					var me = this;
					me.playSound("button-tap");
				}
			},
			'menu > button' : {
				tap : function(btn, e, eOpts) {
					var me = this;
					try {
						if (this._menuOpen) {
							Ext.Viewport.hideAllMenus();
							this._menuOpen = false;
						}
						var menuText = btn.getItemId(); // btn.menu;
						console.log("2: MENU from ItemID:" + menuText);
						var navMain = me.getMain();
						this._currentPage = null;
						if (menuText) {
							if (menuText != "menuHome99") {
								console.log('3: getCurrentPage:' + menuText);
								me._currentPage = this.getCurrentPage(menuText);
								//console.error(me._currentPage);
								if (me._currentPage == null) {
								} else {
									//console.error(me._currentPage.getItemId());
									switch (me._currentPage.getItemId()) {
										
										case "systemConfig" :
											var mainPage = me.getMainpage();
											mainPage.setActiveItem(5);
											break;
										case "mainpage" :
											me.gotoHome();
											break;
									}
								}

							} else {
								me.popPage();
							}
						}
					} catch (ex) {
						console.log("ERROR: menu>button " + ex);
					}
				}
			},
			mainpage : {
				activeitemchange : function(thisPage, tabItem, oldValue, eOpts) {
					
					var me = this;
					var locMod = 'mainpage';
					me.debugHandler(locMod,"info",locMod);
					//console.log("TAB CLICK:" + tabItem);
					if (tabItem == 0) {
						// nothing to do
					} else {
						console.log('tab change ' + tabItem.getItemId());
						// if (!me._isPlaying) { me.playSound('button-tap');}
						// navigator.vibrate(250);
						switch (tabItem.getItemId()) {
							case "tabUtama" :
								if (!me._MenuHome) {
									me._MenuHome = Ext
											.create('mhelpdesk.component.MenuHome');
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
								var systemConfig = me.getSystemConfig();
								//systemConfig.initData();
								break;
							case "tabTicket" :
								
								break;
						}
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
								console.error("enable backItem");
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
								console.error("disable backItem");
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
						console.error("HERE");
						var dateSelected = me.getFormatDate(newDate);

						me.filter_store("localDailyTimetableStore", "fdate",
								dateSelected);
						me.debugHandler("timetable:dateChange", "info",
								dateSelected,
								me.count_store("localDailyTimetableStore"));
					} catch (ex) {
						console.error(ex);
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
					
					console.error("Click"+key+":"+value);
					var searchStr = key + " LIKE '%"+value+"%'";
					me.load_client(searchStr,true);
				}
			},
			faqList : {
				onRefresh : function(thisPage, thisStore){
					var me = this;
					me.load_faq(true);
				}
			},
			messageList : {
				back : function(thisPage) {
					var me = this;
					me.popPage();
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
							var flag = false;
							var msg = locale.getText("msgTransFail");
	
							Ext.Ajax.request({
								useDefaultXhrHeader : false,
								timeout : 5000,
								scope : me,
								url : system.getDefaultServer() + 'mpost.php',
								method : 'post',
								params : {
									id : ticket_id,
									message : fields['message']
								},
								success : function(response) {
									
									try {
										if (response) {
											var dataResponse = me.getJSON(response.responseText);
											if (dataResponse) {
												msg = dataResponse.message;
												if (dataResponse.success) {
													btn.setRefid(dataResponse.msgid);
													flag = true;
												}
											}
										}
									}catch(ex){
										msg = ex;
									}
									doProcess(flag,msg);
								},
								failure : function(response) {
									if (response) {
										var dataResponse = me.getJSON(response.responseText);
										if (dataResponse) {
											msg = dataResponse.message;
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
							me.displayError(errLabel,errStr, true);
						}
						function doProcess(flag, msg) {
							me.hideMyMasked();
							if (flag) {
								if (btn.isStateReady()) {								
									btn.setTicketid(ticket_id);
									btn.doPost();
								}
								me.getTicketMessage(ticket_id);
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
				submit : function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var locMod = "ticket-submit";
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
									
						console.error(fields);
						if (isValid) {
							me.showMyMasked(locale.getText('waitProcess'),false);
							Ext.Ajax.request({
								useDefaultXhrHeader : false,
								timeout : 5000,
								scope : me,
								url : system.getDefaultServer() + 'mopen.php',
								method : 'post',
								params : {
									name : fields['name'],
									email : fields['email'],
									phone : fields['phone'],
									topicId : fields['topicId'],
									subject : fields['subject'],
									message : fields['message'],
									pri : fields['pri']
									
								},
								success : function(response) {	
									var ticketID = "";
									try {
										console.error(response);
										if (response) {
											var dataResponse = me.getJSON(response.responseText);
											if (dataResponse) {
												msg = dataResponse.message;
												if (dataResponse.success) {
													//getRefid
													btn.setRefid(dataResponse.msgid);
													btn.setTicketid(dataResponse.ticket_id);
													ticketID = dataResponse.ticketID;
													flag = true;
												}
											}
										}										
									}catch(ex) {
										msg = ex;
									}
									doProcess(flag,msg,ticketID);
								},
								failure : function(response) {
									console.error(response);
									if (response) {
										var dataResponse = me.getJSON(response.responseText);
										if (dataResponse) {
											msg = response.responseText;
										}
									}
									doProcess(false, msg);									
								}
							});
						}else{
							var errStr="";
							Ext.each(errors, function(error, index) {
								errStr += "[" + (index + 1) + "] - " + error.field + " "
										+ error.reason + "<br>";
							});							
							me.displayError(errLabel,errStr, true);
							me.handleFormError(errors);
						}
						function doProcess(flag, msg, ticketID) {
							var page;
							me.hideMyMasked();
							if (flag) {
								me.debugHandler(locMod,"log",msg);
								if (btn.isStateReady()) {									
									btn.doPost();
								}
								page = Ext.create('mhelpdesk.view.NoticeTicket',{
									user: fields['name'],
									email: fields['email'],		
									ticketID : ticketID
								});
								me.pushPage(page);
								
								me.sendAndroidUserTag(fields['email'],"CLIENT");
								me.sendAndroidNotification2Role("ADMIN", fields['subject'], fields['message']);
								form.reset();
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
						var userTicket = me.getUserTicket();
						userTicket.down("#btnView").setDisabled(false);
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
					try{
						if (me._id) {
							//me.debugHandler(locMod,"info","Check ticket for "+me._email);
							me.showMyMasked(locale.getText('waitProcess'),false);
							me.getTicketById(me._id, function(records, operation, success){
								me.hideMyMasked();
							});
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
												console.error(me._id);
												me.getTicketById(me._id);
												//me.getTicketByEmail(me._email);
												flag = true;
											}
										}
									}
									doProcess(flag,msg);
								},
								failure : function(response) {
									
									if (response) {
										console.error(response);
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
						var mainpage = me.getMainpage();
						var tabTicket = mainpage.down('#tabTicket');
						mainpage.setActiveItem(tabTicket);
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
						console.error("scan click");
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
					var m = thisPage.getItemId() + "-save";
					var isValid = true;
					var errors = new Array();
					me.debugHandler(m, "info", "save daily time table");
					try {
						console.error(thisPage.getMODE());
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
						me.errHandler(ex, m);
					}

				},
				remove_subject : function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var m = thisPage.getItemId() + "-save";
					me.debugHandler(m, "info", "delete daily time table");
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
						me.errHandler(ex, m);
					}
				},
				cancel : function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var m = thisPage.getItemId() + "-cancel";
					try {
						me.popPage();
					} catch (ex) {
						me.errHandler(ex, m);
					}
				},
				info : function(thisPage, thisButton, e, eOpts) {
					var me = this;
					var m = thisPage.getItemId() + "-info";
					try {
						me.doHelp(thisPage);
					} catch (ex) {
						me.errHandler(ex, m);
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
					var m = thisPage.getItemId() + "-save";
					me.debugHandler(m, "info", "save daily time table");
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
						me.errHandler(ex, m);
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
					var m = 'fileUpload-resetPicture';
					try{
						console.error("reset");
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
						me.errHandler(ex,m);
					}
				},
				setPicture : function() {
					var me = this;
					var m = 'fileUpload-resetPicture';
					try{
						console.error("set");
						me.showMyMasked(locale.getText('msgWaitPage'),
									false);
						me.doDelay(5000, function() {
									// mainPage.setMasked(false);
									window.location.reload();
								});
					}catch(ex){
						me.errHandler(ex,m);
					}
				}
			},
			fileBtn : {
				success : function(path){
					var locMod = "onFileUploadSchoolImgSuccess";
					var me = this;
					console.error("success"+path);
					//me.uploadSetPath(me.getSchoolImgPath(), me.getLoadedImageImg(), path);
				},
				failure : function(message, response) {
					var locMod = "onFileUploadSchoolImgFailure";
					console.error("fail");
					//this.uploadPathFail(locMod, message);
				}
			},
			fileBtnPostMessage : {
				success : function(path, response){
					console.error(response);
				},
				failure : function(message, response) {
					var locMod = "fileBtnPostMessage-Error";
					console.error("fail");
					//this.uploadPathFail(locMod, message);
				},
				fileReady : function(file) {
					var me = this;
					var locMod = "fileBtnPostMessage-fileReady";
					me.debugHandler(locMod,"info",locMod);
					try{
						console.error(file.name);
						var page = me.getPostMessage();
						page.down('#filename').setHtml(file.name);
					}catch(ex){
						me.errHandler(ex,locMod);	
					}
				}
			},
			fileBtnTicket : {
				success : function(path, response){
					console.error(response);
				},
				failure : function(message, response) {
					var locMod = "fileBtnTicket-Error";
					console.error("fail");
					//this.uploadPathFail(locMod, message);
				},
				fileReady : function(file) {
					var me = this;
					var locMod = "fileBtnTicket-fileReady";
					me.debugHandler(locMod,"info",locMod);
					try{
						console.error(file.name);
						var page = me.getTicket();
						page.down('#filenameTicket').setHtml(file.name);
					}catch(ex){
						me.errHandler(ex,locMod);	
					}
				}
			}
			
		}
	},
	refreshMainTitle : function(thisPage) {
		var me = this;
		var locMod="";
		try{
			var navBar = thisPage.getNavigationBar();
			console.error(thisPage.getTitle()+":"+navBar.getTitle());
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
				me.showToast(locale.getText("noCamera"), 3)
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
		var m = thisPage.getItemId() + "-help";
		me.debugHandler(m, "info", "help module", "...");
	},
//	onPush : function(view) {
//		var state = { 'page_id': 1, 'user_id': 5 };
//		var title = 'Hello World';
//		var url = 'hello-world.html';
//		
//		history.pushState(state, title, url);
//		history.pushState(view); //push the state
//	},
//	onBack: function () {
//	    history.back();  //pop the state to trigger listener in step 3
//	    return false;  // return false so listener will take care of this
//	},
	pushPage : function(page) {
		var me = this;
		var locMod = "pushPage";
		me.debugHandler(locMod, "info", locMod, page.getItemId());
		try {
			// console.error("test");

			var main = me.getMain();
			
			var curPageID = main.getActiveItem().getItemId();
			console.error("Page:" + curPageID+":"+page.getItemId());
			
			if (page.getItemId() != curPageID) {
				
				main.push(page);
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
			//me.doPop();
			
			var main = me.getMain();
			main.getLayout().setAnimation(false);
			if (noPage) {
				main.pop(noPage);
				//me.debugHandler(locMod, "info", "Pop Page", noPage+"...");
			} else {
				main.pop();
				//me.debugHandler(locMod, "info", "Pop Page", "...");
			}
			if (me._maskShow) {
				me.hideMyMasked();
				main.getLayout().setAnimation(true);
			}
			

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
					console.error("disable backItem");
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

					case "mnuSchedule" :
						currPage = new Ext.create("mhelpdesk.view.TimetableNew");
						break;
					case "mnuSetting" :
						currPage = me.getSystemConfig();
						break;	
					case "mnuUpload" :
						currPage = new Ext.create("mhelpdesk.view.FileUpload");
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
	doDelay : function(timer, functionCall) {
		var me = this;
		var locMod = "doDelay";
		try {
			var delayTask = Ext
					.create('Ext.util.DelayedTask', functionCall, me);
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
	setMenuHome : function(menu) {
		var locMod = "setMenuHome";
		var me = this;
		try {
			console.log("set munu home");
			switch (me._sysRole) {
				case "ADMIN" :
				default :
					break;
			}
			// menu.down('#mnuSetupUser').setHidden(true);
			// if (me._user == "admin") {
			// menu.down('#mnuSetupUser').setHidden(false);
			// }
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
							"575d28b7-1bdf-48d0-8871-fbf29029345c", {
								googleProjectNumber : "146745909965"
							}, notificationOpenedCallback);
				}catch(ex){
					
				}
		
			}
		} catch (ex) {

		}
		
	},
	sendAndroidNotification2Role : function(role, title, message, sendDate, callback) {
		var me = this;
		var locMod = "sendAndroidNotification2Role";
		me.debugHandler(locMod, "info", "SEND ANDROID NOTIFICATION");
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
				company : "WTDESK",
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
				me.debugHandler(locMod, 'info', "Send Log "+role, msg);
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
				company : "WTDESK",
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
				me.debugHandler(locMod, 'info', "Send Log "+user, msg);
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
		me.debugHandler(locMod, "info", "END USER TAGS " + me._user,
				me._sysRole);
		try {
			if (me._deviceOS == "Android" || me._deviceOS == "iOS") {
				window.plugins.OneSignal.sendTags({
							user : user,
							company : "WTDESK",
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
		var m = "controller-checkSetting";
		try{
			var blnFlag = false;
			me._localSystemSettingStore = Ext.getStore("localSystemSettingStore");
			if (!me._localSystemSettingStore) {
				me.debugHandler(m,"error","No Setting File",false);
				callback(false);
			}else{
				me._localSystemSettingStore.load({
					callback : function(records, operation, success) {
						//console.error("Setting File?"+records.length);
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
									record.data.company);
									
								system.setLocalSystemSettingStore(me._localSystemSettingStore);
								system.setDeviceOS(me._deviceOS);
	
								me._lang = lang;
								me._screenMode = record.data.screen_mode;
							
							}catch(ex){
								me.errHandler(ex,m);
							}
							
						}
//						if (records.length>0) {
//							blnFlag=true;
//							
//							var record = records[0];
//							console.error(record);
//							try{
//								//var title = record.get("title");
//								//var members = record.get("members");
//								var lang = record.get("locale");
//								var ticker_interval = record.get("ticker_interval");
//								var sound = record.get("sound");
//								var soundFlag = false;
//			
//								
//								//console.log((sound == 1) );
//								if (sound == 1) {
//									soundFlag = true;
//								}
//								//console.error("sound"+soundFlag);
//								var notice = record.get("notice");
//								var color_true = record.get("color_true");
//								var color_false = record.get("color_false");
//								//var email = record.get("email");
//								//var phone = record.get("phone");
//								var screenMode = record.get("screen_mode");
//								var theme = record.get("theme");
//								
//								//system.setTitle(title);
//								//system.setMembers(members);
//								system.setLanguage(lang);
//								
//								system.setTickerInterval(ticker_interval);
//								system.setSound(soundFlag);
//								//console.error("Here");
//								system.setNotice(notice);
//								system.setColorTrue(color_true);
//								system.setColorFalse(color_false);
//								//system.setEmail(email);
//								//system.setPhone(phone);
//								system.setLocalSystemSettingStore(me._localSystemSettingStore);
//								system.setDeviceOS(me._deviceOS);
//								system.setScreenMode(screenMode);
//								system.setTheme(theme);
//								
//								system.setTitle(record.data.title);
//								system.setEmail(record.data.email);
//								system.setMembers(record.data.members);
//								system.setPhone(record.data.phone);
//								system.setCompany(record.data.company);
//								
//								me._lang = lang;
//								me._screenMode = screenMode;
//							
//							}catch(ex){
//								me.errHandler(ex,m);
//							}
//							
//						}
//						me.load_config(false);

						if (callback) {
							callback(blnFlag);
						}
					}
				});
			}
		}catch(ex){
			me.errHandler(ex,m);
		}
	},
	initData : function() {
		var locMod = "initData";
		var me = this;
		me.debugHandler(locMod,"info",locMod);
		try {
			me._countNav = 0;
			me._localSystemSettingStore = Ext.getStore("localSystemSettingStore");
			if (me._localSystemSettingStore === undefined) {
				me.debugHandler(locMod, "warn", "Create Initial Data", "...");
				me.setupData();
			} 
			
			me.debugHandler(locMod, "warn", "Load Initial Data", "...");
			me.load_faq(false);
			me.load_topic(false);
			me.load_priority(false);
			me.load_config(false);
		} catch (ex) {
			this.errHandler(ex, locMod);

		}
	},
	load_dailytimetable : function() {
		var me = this;
		var m = "controller-load_dailytimetable";
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
			me.errHandler(ex, m);
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
				me.debugHandler(locMod,"info","menuItem Click");
				var me = this;

				// console.log("SET Menu ");
				// this.debugHandler(locMod,"info","SET MENU","...");
				// console.log(button);
				// if (this._menuOpen && this._menuCurrent == "HOME") {
				if (this._menuOpen) {
					Ext.Viewport.hideAllMenus();
					this._menuOpen = false;

				} else {
					this._menuOpen = true;
					// this._menuCurrent = "HOME";

					// console.log(me._menu);
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
			var mainpage = me.getMainpage();
			var homepage = me.getHomepage();
			me.popPage();
			me._countNav = 0;
			mainpage.setActiveItem(0);
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
			var items = Ext.ComponentQuery
					.query('button[pathButtonType=menuitem]');
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
		var returnDate = day + "-" + mon + "-" + dDate.getFullYear();// format('Y-m-d');
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
	initSystemConfig : function(title,members,lang,ticker_interval,soundFlag,notice,color_true,color_false,email,phone,screenMode,theme,company) {
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
			system.setCompany(company);

		}catch(ex){
			me.errHandler(ex, locMod);
		}
	},
	setupData : function(callback) {
		var me = this;
		var m = "controller-setupData";
		try {
			var title = system.getTitle();
			var email = system.getEmail();
			var members = system.getMembers();
			var phone = system.getPhone();
			var company = system.getCompany();
			
			var dataSetting = Ext.create('mhelpdesk.model.SystemSetting', {
						"sys_id" 		: 1,
						"title" 		: (title) ? title : "Mobile Helpdesk",
						"members" 		: (members) ? members : "Support Team",
						"locale" 		: "en",
						"ticker_interval" : 350,
						"sound" 		: 0,
						"notice" 		: "Mobile Helpdesk Application ... ",
						"color_true" 	: "green",
						"color_false" 	: "red",
						"email" 		: (email) ? email : "support@wbiztech.com",
						"phone" 		: (phone) ? phone : "+6012-11111111",
						"screen_mode" 	: 0,
						"company" 		: (company) ? company : "Wbiztech Sdn Bhd",
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
								record.data.company);
								
							system.setLocalSystemSettingStore(me._localSystemSettingStore);
							system.setDeviceOS(me._deviceOS);

							me._lang = lang;
							me._screenMode = record.data.screen_mode;
						
						}catch(ex){
							me.errHandler(ex,m);
						}
						
					}
					if (callback) {
						callback(records, operation, success);	
					}

				}
			});

		} catch (ex) {
			me.errHandler(ex, m);
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
			record.set(field, data);
			record.save();
			me._localSystemSettingStore.sync();
		} catch (ex) {
			me.errHandler(ex, locMod);
		}
	},
	count_store : function(storeId) {
		var me = this;
		var localStore = Ext.getStore(storeId)
		var m = "count_store-" + storeId;

		var retCount = 0;
		try {
			if (localStore) {
				retCount = localStore.getTotalCount();
			}
		} catch (ex) {
			me.errHandler(ex, m);
		}
		me.debugHandler(m, "info", "Count " + storeId, retCount);
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
				console.error(ex);
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
				console.error(ex);
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
			page.setTopText("error", 'OFFLINE!', false, false);
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
	getTicketByEmail : function(email, callback) {
		var me = this;
		var locMod = "getTicketByEmail";
		this.debugHandler(locMod, "info", locMod, "...");
		try {
			var strFilter = "ticket.email='"+email+"'";
			
			var params = {
				type : 'single',
				table : 'rz_ticket',
				filter : strFilter,
				sort : 'ticket.created',
				direction : "DESC"
			};
			var remoteStore = Ext.getStore('remoteTicketStore');
			var localStore = Ext.getStore('localTicketStore');
			me._localTicketStore = localStore;
			localStore.load();
		
			function doProcess(records, operation, success) {
				if (callback) {
					callback(records, operation, success);
				}
			}
			me.remoteStoreCall(locMod,params,remoteStore,localStore,true,doProcess);
		} catch (ex) {
			me.errHandler(ex, locMod);
		}
	},
	getTicketById : function(id, callback) {
		var me = this;
		var locMod = "getTicketById";
		this.debugHandler(locMod, "info", locMod, "...");
		try {
			var strFilter = "ticket.ticket_id="+id;
			
			var params = {
				type : 'single',
				table : 'rz_ticket',
				filter : strFilter,
				sort : 'ticket.created',
				direction : "DESC"
			};
			var remoteStore = Ext.getStore('remoteTicketStore');
			var localStore = Ext.getStore('localTicketStore');
			me._localTicketStore = localStore;
			localStore.load();
		
			function doProcess(records, operation, success) {
				if (callback) {
					callback(records, operation, success);
				}
			}
			me.remoteStoreCall(locMod,params,remoteStore,localStore,true,doProcess);
		} catch (ex) {
			me.errHandler(ex, locMod);
		}
	},
	getTicketMessage : function(ticket_id, callback) {
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
		
			function doProcess(records, operation, success) {
				if (callback) {
					callback(records, operation, success);
				}
			}
			me.remoteStoreCall(locMod,params,remoteStore,localStore,true,doProcess);
		} catch (ex) {
			// //console.error("ERR load_school:" + ex);
			me.errHandler(ex, locMod);
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
				me.getTicketMessage(ticket_id);
				
				var strHtml = '<div class="ticket_hdr">' 
				+ '<span style="font-weigth:bold;font-size: 1em;">' + locale.getText('Ticket') + ' #'+record.get("ticketID")+' ('+record.get("status")+')</span><br>'
				+ '<span style="font-size: .7em;">' + locale.getText('DateCreate') + ': '+record.get("fcreated")+'<br>'
				+ record.get("name")+' (' +record.get("dept_name")+ ')<br>'
				//+ 'Department: '+record.get("dept_name")+'<br>'
				+ '<a href="'+ record.get("email")+'"><i class="fa fa-envelope-o fa-1x"></i> '+ record.get("email")+'</a> <a href="'+ record.get("phone")+'"><i class="fa fa-phone fa-1x"></i> '+ record.get("phone")+'</a><br>'
				+ '</span><br>'
				+ '<span>'+record.get("subject")+'</span>'
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
				sort : 'category',
				direction : "ASC"
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
				me.localStoreCall(locMod,localStore,callback);
			} else {
				me.remoteStoreCall(locMod,params,remoteStore,localStore,refresh,callback);
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
				me.remoteStoreCall(locMod,params,remoteStore,localStore,refresh,callback);
			}

		} catch (ex) {
			me.errHandler(ex, locMod);
			callback(null,null,false);
		}
	},
	load_client : function(filter, refresh, callback) {
		var me = this;
		var locMod = "load_client";
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
							try {
								if (!success) {
									mode = 'local';
									records = me.offlineMode(localStore);
								} else {
									mode = 'remote';
									me.syncLocal(success, remoteStore,
											localStore, records, refresh);
									me.showDebugData(locMod, "REMOTE",
											localStore, records.length);
									if (main) {
										main.setTopText("success", "ONLINE", false, true);
									}
								}

							} catch (ex) {
								me.errHandler(ex, locMod);
							}
							if (callback) {
								callback(records, mode, success);
							}
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
		var m = 'controller-remove_dailytimetable';
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
			me.errHandler(ex, m);
		}
		return blnFlag;
	},
	save_dailytimetable : function(thisPage) {
		var me = this;
		var m = 'controller-save_dailytimetable';
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
			me.errHandler(ex, m);
		}
		return blnFlag;
	},
	save_systemconfig : function(thisPage) {
		var me = this;
		var m = 'controller-save_systemconfig';
		var blnFlag = false;
		try {
			var form = thisPage; // newnotification
			var fields = form.getValues();
			if (!me._localSystemSettingStore) {
				me._localSystemSettingStore = Ext
						.getStore('localSystemSettingStore');
			}
			var soundFlag = 0;
			var screenMode = 0;
			//console.error(fields["sound"]);
			if (fields["sound"]) {
				soundFlag = 1;
			}
			if (fields["screen_mode"]) {
				screenMode = 1;
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
						"company" : fields["company"]
					});
			me.debugHandler(m,"info","Saving ", "..");
			me._localSystemSettingStore = Ext
					.getStore('localSystemSettingStore');
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
			me.errHandler(ex, m);
		}
		return blnFlag;
	},
	rearrange_dailytimetable : function(fdate) {
		var me = this;
		var m = 'controller-rearrange_dailytimetable';
		try {
			var localStore = Ext.getStore("localDailyTimetableStore");
			me.filter_store("localDailyTimetableStore", "fdate", fdate);
			localStore.each(function(item) {
						try {
							var stime = item.get("stime");
							var stime_minutes = me.getMinutes(stime);
							console.error(item.get("timetable_id") + stime
									+ ":" + stime_minutes);
						} catch (ex) {
							me.errHandler(ex, locMod);
						}
					});
			// localStore.sync();
		} catch (ex) {
			me.errHandler(ex, m)
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
	launch : function(app) {
		var locMod = "launch";
		var me = this;
		me._build = "2.0.1";
		me.debugHandler(locMod, "info", "SYSTEM STARTED ", me._build + "...");
		
		try {
			locale = mhelpdesk.view.Locale;
			system = mhelpdesk.view.System;
			system.setBuild("Build "+me._build);
			me.showMyMasked(locale.getText('msgWaitPage'),false);
		    function displayPage() {
		    	var main = me.getMain();
		    	main.setTopText("normal", me._connection,false,false);
				main.setTopText("normal", system.getBuild(),false,false);
				
		    	main.initScreenMode(me._screenMode);
								
				me.createPathMenu();
				
				me._menu = Ext.create('mhelpdesk.component.MenuHome');
				me.setMenuHome(me._menu);
				
				var mainPage = me.getMainpage();
				mainPage.initTabItem(me._localConfigStore);
		    }
			var mainApp = function(proceed){
				//me.showMyMasked(locale.getText('msgWaitPage'),true, 60000);
				if (proceed) {
					me.initData();
					me._lang = system.getLanguage();
					locale.localize(me._lang);
					mhelpdesk.app.switchMainView('mhelpdesk.view.Main');
					var theme = system.getTheme();
					var curTheme=me.currentCSS(theme);
					me.changeCSS('resources/css/'+theme, curTheme);
					
					me.debugHandler(locMod, "info", "Init Setting:", "...");					
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
					
					me.debugHandler(locMod, "log", "company:", system.getCompany());
					me.debugHandler(locMod, "log", "email:", system.getEmail());
					me.debugHandler(locMod, "log", "phone:", system.getPhone());
					me.debugHandler(locMod, "log", "title:", system.getTitle());
					me.debugHandler(locMod, "log", "member:", system.getMembers());
					
					displayPage();
				}else{
					me.showMyMasked(locale.getText('msgWaitPage'),true, 60000);
					me.debugHandler(locMod,"error","NEW INITIALIZED APP","...");
					//me.sendAndroidUserTag("rudzuan@gmail.com","ADMIN");
					me.load_config(true, function(records, operation, success) {
						var recordConfig = records[0];
						var email_id = 1;
						var title = "Mobile Helpdesk";
						if (recordConfig) {
							email_id =  recordConfig.get('default_email_id');	
							title = recordConfig.get('helpdesk_title');
						}
						me.getEmail('email_id='+email_id,function(records, operation, success){
							var recordEmail = null;	
							if (success) {
								recordEmail = records[0];
								system.setTitle(title);								
								system.setEmail(recordEmail.get('email'));
								system.setMembers(recordEmail.get('name'));
								system.setPhone(recordEmail.get('phone'));
								system.setCompany(title);
							}
							me.setupData(function(records, operation, success) {						
								mainApp(true);
							});	
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
	errHandler : function(err, locMod) {
		var me = this;
		try {
			me.hideMyMasked();
			// me.showToast(locale.getText('msgTransFail'),3)
			var page = null;
			page = me.getMain();

			if (locMod) {
				me._debugModule = locMod;
			}
			if (me._isDebug) {
				page.setBottomText("Error " + me._debugModule + ":" + err,
						false, true);
			}
			console.error(me._debugModule + " ERROR:" + err);
			// console.error("Error " + ":" + err);

		} catch (ex) {
		}
	},
	debugHandler : function(module, msgtype, title, msg, setflag) {
		var me = this;
		var locMod = "debugHandler";
		try {
			me._debugLine += 1;
			var strInfoMsg = "#" + me._debugLine + " ";
			var strContent = "";
			if (module) {
				strContent += "[" + module + "]: ";
			}
			if (title) {
				strContent += "" + title;
			}
			if (msg) {
				strContent += "-" + msg;
			}else if (msg==0||msg==false) {
				strContent += "-" + msg;
			}

			if (msgtype == "error") {
				console.error(strInfoMsg + strContent);
			} else if (msgtype == "log") {
				console.log(strContent);
			} else if (msgtype == "warn") {
				console.warn(strInfoMsg + strContent);
			} else {
				// info
				console.info(strInfoMsg + strContent);
			}
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
			console.error("Error " + me._debugModule + ":" + err);

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
		me.debugHandler(locMod,"info",locMod);
		var link=null;
		try {
			var oldlinks = document.getElementsByTagName("link");
			//console.error(oldlinks);
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
		me.doDelay(5000, function() {
			// mainPage.setMasked(false);
			me.showToast(locale.getText('waitRefresh'), 3);
			window.location.reload();
		});
    }
});
