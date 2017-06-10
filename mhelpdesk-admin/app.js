/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/
Ext.Loader.setConfig({
	enabled : true,
	disableCaching : true
	// set true for no cache first default=> false // Turn OFF cache BUSTING
});

Ext.Loader.setPath({
	'Ext' : 'touch/src',
	'Ext.ux' : 'app/lib',
	'Ext.plugin.google' : 'app/lib/plugin/google',
	'wtadmin.view' : 'app/view',
	'wtadmin.controller' : 'app/controller',
	'wtadmin.model' : 'app/model',
	'wtadmin.store' : 'app/store',
	'wtadmin.component' : 'app/xcomponent'
});
Ext.override('Ext.Window', {
	closeAction : 'hide'
});
var locale = null;
var utils = null;
var app = null;
var _debugLine=0;
Ext.application({
    name: 'wtadmin',
    appFolder : 'app',
    icon: "resources/icons/Icon.png",
    phoneIcon: "resources/icons/Icon_Android36.png",
    tabletIcon: "resources/icons/Icon~ipad.png",

    requires: [
        'Ext.MessageBox','wtadmin.component.Locale','wtadmin.component.Utils','wtadmin.component.MenuButton','wtadmin.component.MenuHome'
    ],
    controllers : ['MainController'],
    views: [
        'Main'
    ],
    models: [],
    stores: [],

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },
    
    sessionTimeout : 1000 * 60 * 60 * 12, // 12 hours
    currentView : null,
    
    launch: function() {
    	console.log('App Launch');
    	//Init global variable;
    	locale=wtadmin.component.Locale;
    	utils=wtadmin.component.Utils;
    	app=wtadmin.app;
    	
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();

        // Initialize the main view
        //Ext.Viewport.add(Ext.create('wtadmin.view.Main'));
        document.addEventListener('deviceready', function() {

			document.addEventListener("offline", function() {
						wtadmin.app.fireEvent('offline', this);
					}, false);
			document.addEventListener("online", function() {
						wtadmin.app.fireEvent('online', this);
					}, false);

			var deviceOS = Ext.os.name;
			var browser = Ext.browser.name;
			var deviceType = Ext.os.deviceType;
			// alert(deviceOS);
			// document.addEventListener("backbutton",
			// Ext.bind(onBackKeyDown, this), false);
			wtadmin.app.fireEvent('deviceready', deviceOS,
					browser, deviceType);
		}, false);
		document.addEventListener("backbutton", function() {
			wtadmin.app.fireEvent('backbutton', this);

		}, false);
    },
    showToast : function(msg, waitTime) {
		var defaultWait = 3000; // 3sec
		if (waitTime) {
			defaultWait = waitTime * 1000;
		}
		Ext.toast(msg, defaultWait);

	},
    switchMainView : function(newView, config) {
    	var locMod="app.switchMainView";
		try {
			this.debugHandler('Showing', newView, locMod);
			if (this.currentView) {
				this.debugHandler("remove view" , this.currentView.getItemId(), locMod);
				Ext.Viewport.remove(this.currentView.getItemId());
			}

			// wait 100 ms
			// Ext.Function.defer(this.changeView(newView, config), 100, this);

			this.currentView = Ext.create(newView, config);
			this.debugHandler("add view" , this.currentView.getItemId(), locMod);
			//Ext.Viewport.add(this.currentView);
			Ext.Viewport.setActiveItem(this.currentView,{type: 'slide', direction: 'right'});

		} catch (ex) {
			me.errHandler(ex,locMod);
		}

	},
	eh : function(err, module) {
		this.errHandler(err, module);
	},
	dh : function(title, msg, module, msgtype) {
		this.debugHandler(title, msg, module, msgtype);
	},
    errHandler : function(err, module) {
		try {
			if (Ext.isEmpty(module)) { module=""; } else { module+=": "; }
			console.error(module + err);
		} catch (ex) {
		}
	},
	debugHandler : function(title, msg, module, msgtype) {
		var me = this;
		try {
			_debugLine += 1;
			
			if (Ext.isEmpty(module)) { module=""; } else { module+=": "; }
			if (Ext.isEmpty(msg)) { msg=""; } else { title+=", "; }
			
			if (msgtype == "error") { console.error("#" + _debugLine + " " + module + title + msg);
			} else if (msgtype == "log") { console.log(title + msg);
			} else if (msgtype == "warn") { console.warn("#" + _debugLine + " " + module + title + msg);
			} else { // info
				console.info("#" + _debugLine + " " + module + title + msg);
			}
		} catch (ex) {
		}
	},
    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
