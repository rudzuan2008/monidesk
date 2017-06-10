Ext.define('wtadmin.component.Utils', {
	singleton : true,
	config : {
	},
	isRecordEmpty: function(records) {
		var length = Object.keys(records).length;
		if (length != 0) {
			return false;
		}else{
			return true;
		}
	},
	setMasked : function(form, msg) {
		if (!Ext.isEmpty(form)) {
			form.setMasked({
				xtype : 'loadmask',
				message : 'Signing In...'
			});
		}
	},
	offMasked : function(form) {
		if (!Ext.isEmpty(form)) {
			form.setMasked(false);
		}
	},
	showMyMasked : function(msg) {
		var locMod = "utils.showMyMasked";
		var me = this;
		try {
			app.debugHandler("Show Masked", "...",locMod,"warn");
			if (app.currentView) {
				app.currentView.setMasked({
							xtype : 'loadmask',
							message : msg
						});
				var delayTask = Ext.create('Ext.util.DelayedTask', function() {
							me.hideMyMasked();
						}, this);
				delayTask.delay(5000);
			}
		} catch (ex) {
			app.errHandler(ex,locMod);
		}
	},
	hideMyMasked : function() {
		if (app.currentView) {
			app.currentView.setMasked(false);
		}
	},
	execDelay : function(thisFunction, delay) {
		if (!delay) { delay = 5000; }
		var delayLogout = Ext.create('Ext.util.DelayedTask', thisFunction, this);

		delayLogout.delay(delay);
	},
	dialogMesg: function(title,msg,thisFunction) {
		Ext.Msg.confirm(title,msg,thisFunction);
	},
	getDefaultServer: function() {
		return 'http://localhost/hdesk-v2/mhelpdesk-admin'; //  "http://localhost/sc-now/"; //
		//return 'http://localhost/hdesk/'; //  "http://localhost/sc-now/"; //
	}

});