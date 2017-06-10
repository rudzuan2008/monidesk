/*
 * This file is generated and updated by Sencha Cmd. You can edit this file as
 * needed for your application, but these edits will have to be merged by Sencha
 * Cmd when it performs code generation tasks such as generating new models,
 * controllers or views and when running "sencha app upgrade".
 * 
 * Ideally changes to this file would be limited and most work would be done in
 * other places (such as Controllers). If Sencha Cmd cannot merge your changes
 * and its generated code, it will produce a "merge conflict" that you will need
 * to resolve manually.
 */
Ext.Loader.setConfig({
	enabled : true,
	disableCaching : true
		// set true for no cache first default=> false // Turn OFF cache BUSTING
	});
Ext.Loader.setPath({
			'Ext' : 'touch/src',
			'Ext.ux' : 'app/lib',
			// 'Ext.ux.ListPullRefresh' : 'app/lib/ListPullRefresh.js',
			//'Ext.ux.touch.grid' : 'app/lib/Ext.ux.touch.grid',
			'Ext.plugin.google' : 'app/lib/plugin/google',
			'mhelpdesk.view' : 'app/view',
			'mhelpdesk.view.profile' : 'app/view/profile',
			'mhelpdesk.view.user' : 'app/view/user',
			'mhelpdesk.view.notification' : 'app/view/notification',
			'mhelpdesk.view.event' : 'app/view/event',
			'mhelpdesk.view.ticket' : 'app/view/ticket',
			'mhelpdesk.view.client' : 'app/view/client',
			'mhelpdesk.view.visitor' : 'app/view/visitor',
			'mhelpdesk.controller' : 'app/controller',
			'mhelpdesk.model' : 'app/model',
			'mhelpdesk.store' : 'app/store',
			'mhelpdesk.component' : 'app/component'
		});
Ext.override('Ext.Window', {
			closeAction : 'hide'
		});
var mainController = null;
var app = null;
var locale = null;
var system = null;
var utils = null;
var isLogin = false;
var isDebug = true;
var user = null;
var defaultServer = null;
var _debugLine=0;
Ext.application({
	name : 'mhelpdesk',
	appFolder : 'app',
	requires : ['Ext.MessageBox', 
			'Ext.Button',
			'Ext.SegmentedButton',
			'Ext.Panel',
			'Ext.Toolbar',
			'Ext.device.Storage',
			'Ext.device.Camera',
			'Ext.device.FileSystem',
			'Ext.device.Connection',
			'Ext.Menu',
			'Ext.MessageBox',
			'Ext.viewport.Default',
			'Ext.util.DelayedTask',
			'Ext.field.File',
			'Ext.field.FileInput',
			'Ext.Toast',
			'Ext.Anim',
			'Ext.ux.PathMenu',
			'Ext.Img',
			'Ext.Label',
			'Ext.field.DatePicker',
			'Ext.ux.PullRefreshFn',
			'Ext.field.Toggle',
			'Ext.ux.MessageBoxPatch',
			'Ext.ux.PaintMonitor',
			'Ext.field.Number',
			'Ext.field.Hidden',
			'Ext.ux.Fileup',
			'Ext.Carousel',
			'Ext.field.Search',
			'Ext.field.Password',
			//'Ext.ux.touch.grid.List',
			'mhelpdesk.component.MenuButton',
			'mhelpdesk.component.MenuHome',
			'mhelpdesk.component.MenuNotification',
			'mhelpdesk.component.MenuActivity'],
			
	controllers : ['MainController'],
	views : ['Main', 'MainPage', 'MainPage2', 'HomePage', 'System', 'Utils', 'Locale', 'SystemConfig','NotificationPage','notification.Notification','EventPage','event.Event',
	         'Timetable', 'TimetableNew', 'TimetableList','FileUpload', 'Login', 'SosPage','ticket.SosList','ticket.SosAction', 'VisitorPage'
	         ,'Status','Search', 'Faq', 'FaqList', 'Ticket', 'ClientList', 'Intercom', 'CallList','OccupantPage','client.OccupantList', 'visitor.Register'
	         ,'UserTicket', 'TicketList', 'ViewTicket', 'MessageList', 'PostMessage', 'NoticeTicket', 'NoticeTicketFail', 'GuardPage', 'StatusPage'
	         ,'VisitorListPage', 'visitor.VisitorList','visitor.ViewVisitor','visitor.registerDelivery','visitor.ViewDelivery' 
	        ],
	        
	models : ['DailyTimetable','SubjectTimetable', 'SystemSetting', 'LoadedImage','Notification','Event','Product', 'Intercom', 'GuardIcon', 'VisitorIcon','ResidentIcon',
	          'Faq', 'Client', 'Topic', 'Priority', 'Ticket', 'TicketSOS', 'TicketVisitor', 'Message', 'Config', 'Email', 'Page', 'PageDetail', 'ClientUnit'
	        ],
	        
	stores : ['LocalDailyTimetable','LocalSubjectTimetable','LocalSystemSetting','LocalLoadedImage','LocalNotification','LocalEvent', 'LocalConfig',  'LocalEmail',  'LocalAllClient' 
	          ,'LocalFaq', 'LocalClient',  'LocalTopic',  'LocalPage',  'LocalPageDetail', 'LocalPriority', 'LocalTicket',  'LocalMessage',  'LocalProduct',  'LocalIntercom'
	          ,'LocalSosTicket', 'LocalVisitorTicket', 'LocalGuardIcon', 'LocalVisitorIcon', 'LocalResidentIcon'
	          ,'RemoteFaq','RemoteEvent','RemoteClient','RemoteTopic','RemotePage','RemotePageDetail', 'RemotePriority','RemoteTicket','RemoteMessage','RemoteProduct'
	          ,'RemoteConfig','RemoteEmail','RemoteCommon', 'RemoteAllClient','RemoteSosTicket', 'RemoteVisitorTicket', 'RemoteNotification'
	        ],
	        
	icon : {
		'57' : 'resources/icons/Icon.png',
		'72' : 'resources/icons/Icon~ipad.png',
		'114' : 'resources/icons/Icon@2x.png',
		'144' : 'resources/icons/Icon~ipad@2x.png'
	},

	isIconPrecomposed : true,

	startupImage : {
		'320x460' : 'resources/startup/320x460.jpg',
		'640x920' : 'resources/startup/640x920.png',
		'768x1004' : 'resources/startup/768x1004.png',
		'748x1024' : 'resources/startup/748x1024.png',
		'1536x2008' : 'resources/startup/1536x2008.png',
		'1496x2048' : 'resources/startup/1496x2048.png'
	},

	launch : function() {
		// Destroy the #appLoadingIndicator element
		//Ext.fly('appLoadingIndicator').destroy();
		var locMod = "app.launch";
		var me = this;
    	app=mhelpdesk.app;
    	app.dh('Start','...',locMod);
    	console.error('App Launch');
    	
		mainController = this.getController('MainController');
		
		locale = mhelpdesk.view.Locale;
		system = mhelpdesk.view.System;
		utils = mhelpdesk.view.Utils;
		
		Ext.override(Ext.LoadMask, {
			getTemplate : function() {
				var prefix = Ext.baseCSSPrefix;
				return [{
					// it needs an inner so it can be centered within the
					// mask, and have a background
					reference : 'innerElement',
					cls : prefix + 'mask-inner',
					// the elements required for the CSS loading
					// {@link #indicator}
					// 'images/sc-now-clean.png'
					children : [{
						html : '<div class="text-replacement"><div id="fountainTextG">' +
								'<div id="fountainTextG_1" class="fountainTextG">P</div>' +
								'<div id="fountainTextG_1" class="fountainTextG">l</div>' +
								'<div id="fountainTextG_2" class="fountainTextG">e</div>' +
								'<div id="fountainTextG_2" class="fountainTextG">a</div>' +
								'<div id="fountainTextG_3" class="fountainTextG">s</div>' +
								'<div id="fountainTextG_3" class="fountainTextG">e</div>' +
								'<div id="fountainTextG_4" class="fountainTextG">&nbsp;</div>' +
								'<div id="fountainTextG_5" class="fountainTextG">W</div>' +
								'<div id="fountainTextG_5" class="fountainTextG">a</div>' +
								'<div id="fountainTextG_6" class="fountainTextG">i</div>' +
								'<div id="fountainTextG_6" class="fountainTextG">t</div>' +
								'</div></div>'
					}, {
						reference : 'indicatorElement',
						cls : prefix + 'loading-spinner-outer',
						children : [{
								cls : prefix + 'loading-spinner',
								children : [{
									tag : 'span',
									cls : prefix + 'loading-top'
								}, {
									tag : 'span',
									cls : prefix + 'loading-right'
								}, {
									tag : 'span',
									cls : prefix + 'loading-bottom'
								}, {
									tag : 'span',
									cls : prefix + 'loading-left'
								}]
						}]
					}, {
						// the element used to display the {@link #message}
						reference : 'messageElement'
					}]
				}];
			}
		});

		Ext.Viewport.setMasked({
			xtype : 'loadmask',
			message : 'Loading ...'
		});
					
		Ext.Viewport.on('orientationchange', 
			function(viewport, orientation, width, height) {
				mhelpdesk.app.fireEvent('orientationchange', viewport,
					orientation, width, height);
			}, this);
			
		var delayTask = Ext.create('Ext.util.DelayedTask', function() {
			try {
				// console.log("hide dialog");
				// if (me._noticeBtnFlag == false) {
				Ext.Viewport.setMasked(false);
				// Ext.fly('appLoadingIndicator').destroy();

				// }

				var appLoader = Ext.fly(document.getElementById('appLoadingIndicator'));
				// console.info(appLoader);
				if (appLoader) {
					appLoader.destroy();
				}
			} catch (ex) {
				console.log("mask clear error new:" + ex);
			}
		}, this);
		delayTask.delay(1000);	
		
		document.addEventListener('deviceready', function() {

			document.addEventListener("offline", function() {
						mhelpdesk.app.fireEvent('offline', this);
					}, false);
			document.addEventListener("online", function() {
						mhelpdesk.app.fireEvent('online', this);
					}, false);

			var deviceOS = Ext.os.name;
			var browser = Ext.browser.name;
			var deviceType = Ext.os.deviceType;
			// alert(deviceOS);
			// document.addEventListener("backbutton",
			// Ext.bind(onBackKeyDown, this), false);
			mhelpdesk.app.fireEvent('deviceready', 
				deviceOS, browser, deviceType);
		}, false);
		document.addEventListener("backbutton", function() {
					mhelpdesk.app.fireEvent('backbutton', this);

				}, false);
	},
	initialize : function() {
		console.log('APP initialize');
		// Add a Listener. Listen for [Viewport ~ Orientation] Change.
		
		Ext.Viewport.on('orientationchange', 'onOrientationChange', this);
		this.callParent(arguments);
	},
	onOrientationChange : function(viewport, orientation, width, height) {
		// test trigger and values
		console.log('o:' + orientation + ' w:' + width + ' h:' + height);

		if (width > height) {
			orientation = 'landscape';
			// this.Ext.getComponent('carouselhome').setHeight(150);
		} else {
			orientation = 'portrait';
			// this.Ext.getComponent('carouselhome').setHeight(350);
		}
	},

	showToast : function(msg, waitTime) {
		var defaultWait = 3000; // 3sec
		if (waitTime) {
			defaultWait = waitTime * 1000;
		}
		Ext.toast(msg, defaultWait);

	},
	getCurrentViewPage : function() {
		return this.currentView;
	},
	switchMainView : function(newView, config) {
		var locMod = "switchMainView";
		try {
			console.info('Showing...' + newView);
			// if (this.currentView != false) {
			if (this.currentView) {
				// console.log("remove view:" + this.currentView);
				Ext.Viewport.remove(this.currentView);
			}

			// wait 100 ms
			// Ext.Function.defer(this.changeView(newView, config), 100, this);

			this.currentView = Ext.create(newView, config);
			// console.log("add view:" + this.currentView);
			Ext.Viewport.add(this.currentView);

		} catch (ex) {
			// Ext.Msg.alert("Err switch <br>" + ex);
			mhelpdesk.app.fireEvent('ErrorPage', locMod, ex);
		}

	},
	eh: function(err, module) {
		var me = this;
		me.errHandler(err,module);
	},
	errHandler : function(err, module) {
		try {
			if (Ext.isEmpty(module)) { module=""; } else { module+=": "; }
			console.error(module + err);
		} catch (ex) {
		}
	},
	dh: function(title, msg, module, msgtype) {
		var me = this;
		me.debugHandler(title, msg, module, msgtype);
	},
	debugHandler : function(title, msg, module, msgtype) {
		var me = this;
		try {
			_debugLine += 1;
			
			if (Ext.isEmpty(module)) { module=""; } else { module+=": "; }
			if (Ext.isEmpty(msg)) { msg=""; } else { title+=" "; }
			
			if (msgtype == "error") { console.error("#" + _debugLine + " " + module + title + msg);
			} else if (msgtype == "log") { console.log(title + msg);
			} else if (msgtype == "warn") { console.warn("#" + _debugLine + " " + module + title + msg);
			} else { // info
				console.info("#" + _debugLine + " " + module + title + msg);
			}
		} catch (ex) {
		}
	},
	onUpdated : function() {
		Ext.Msg
				.confirm(
						"Application Update",
						"This application has just successfully been updated to the latest version. Reload now?",
						function(buttonId) {
							if (buttonId === 'yes') {
								window.location.reload();
							}
						});
	},
	initDebug: function(isDebug) {
		system.setIsDebug(isDebug);
		system.setUrlPicturePath('https://www.wtpropertycheck.com/');
		system.setUrlPostPicture('https://www.wtpropertycheck.com/remote/getfile.php');
		system.setPortalServer('https://www.wtpropertycheck.com/');
		console.error('SINI DAH');
		if (isDebug) {
			console.error("HERERERERER");
			system.setIsDebug(isDebug);
			system.setUrlPicturePath('http://www.wtpropertycheck.com/');
			system.setUrlPostPicture('http://www.wtpropertycheck.com/remote/getfile.php');
			system.setPortalServer('http://www.wtpropertycheck.com/');
			console.error(system.getPortalServer());
		}
		defaultServer=system.getDefaultServer();
	
	}
});
