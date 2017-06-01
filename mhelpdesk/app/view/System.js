Ext.define('mhelpdesk.view.System', {
	singleton : true,
	config : {
		user: null,
		fullname: null,
		group: null,
		sysRole: null,
		school: null,
		schoolLogo: null,
		company: null,
		language: 'en',
		sound: true,
		storeMonth: null,
		storeWeek: null,
		pull:null, //boolean True/False
		pullInterval: 1,
		tickerInterval: 350,
		workingStartTime: '8:00:00',
		workingEndTime: '18:00:00',
		urlPostPicture : "http://android.schoolcheck-now.com/hdesk/remote/getfile.php", //"http://localhost/sc-now-android/remote/getfile.php", //
		urlPicturePath : "http://android.schoolcheck-now.com/hdesk/", //"http://localhost/sc-now/", //
//		urlPostPicture : "http://localhost/hdesk/remote/getfile.php", //
//		urlPicturePath : "http://localhost/hdesk/", //
		build: null,
		deviceOS: null,
		cameraOff: false,
		screenMode: 0,
		notice: '',
		localSystemSettingStore: null,
		title: 'EDC Mobile Helpdesk',
		members: 'Kumpulan A -',
		colorTrue: 'green',
		colorFalse: 'red',
		email : '',
		phone : '',
		theme : 'default'
		
	},
	dataTimeout: function(loadType){
		switch (loadType) {
		case "fast" :
			return 3000;
			break;
		case "normal" :
			return 8000;
			break;
		case "heavy" :
			return 10000;
			break;	
		default :
			return 8000;
			break;
		}
		
	},
	randomIntFromInterval: function(min,max)
	{
	    return Math.floor(Math.random()*(max-min+1)+min);
	},
	getDefaultServer: function() {
		return 'http://android.schoolcheck-now.com/hdesk/'; //  "http://localhost/sc-now/"; //
		//return 'http://localhost/hdesk/'; //  "http://localhost/sc-now/"; //
	},
	getLangTranslation : function(text) {
		var locale = mhelpdesk.view.Locale;
		return locale.getText(text);
	},
	initSystemTitle : function(page,title) {
		page.setTitle('<h1 class="one"><span>&nbsp;&nbsp;&nbsp;&nbsp;' + title + '</span></h1>');
	},
	cacheNotificationImage : function(url, cache_path) {
		var me = this;
		var locMod = 'getCacheNotificationImage';
		try {
			var cachePath = "*"+cache_path+"*";
			if (cachePath == "*null*") {
				cachePath = "";
			}
			if (cachePath == "*undefined*") {
				cachePath = "";
			}
			
			if (me.getDeviceOS() == "Android" || me.getDeviceOS() == "iOS") {
				if (cachePath != "") {
					//console.error("return 2 :"+cache_path);
					return cache_path;						
				}else{
					//console.error("return 1 :"+url);
					return  url;	
				}
			}else{
				//console.error("return 3 :"+url);
				return url;
			}
		}catch(ex) {
			mhelpdesk.app.fireEvent('ErrorPage', locMod, ex);
		}
	},
	giveUrlPicturePath : function() {
		this.getUrlPicturePath();
	}
});