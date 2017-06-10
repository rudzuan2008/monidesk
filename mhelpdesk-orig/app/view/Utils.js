Ext.define('mhelpdesk.view.Utils', {
	singleton : true,
	config : {
	},
	getErrors: function(errors) {
		var me = this;
		var errStr = "<div style='color:red;'>";
			Ext.each(errors, function(error, index) {
						errStr += error.field + " - " + error.reason + "<br>";
					});
			errStr += "</div>";
		
		return errStr;
		
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
			app.eh(ex, locMod);
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
				message : msg
			});
		}
	},
	offMasked : function(form) {
		if (!Ext.isEmpty(form)) {
			form.setMasked(false);
		}
	},
	showMyMasked : function(msg, autoClosed) {
		var locMod = "utils.showMyMasked";
		var me = this;
		try {
			//app.dh("Show Masked", "...",locMod,"warn");
			//console.error(mask);
			if (app.currentView) {
				app.currentView.setMasked({
							xtype : 'loadmask',
							message : msg
						});
				//mask.show()
//				me.execDelay(function(){
//					me.hideMyMasked();
//				},5000);		
				if (autoClosed) {		
//					var delayTask = Ext.create('Ext.util.DelayedTask', function() {
//							me.hideMyMasked();
//						}, this);
//					delayTask.delay(5000);
					me.execDelay(function(){
						me.hideMyMasked();
					},5000);
				}
//				var delayTask = Ext.create('Ext.util.DelayedTask', function() {
//							me.hideMyMasked();
//						}, this);
//				delayTask.delay(5000);
			}
		} catch (ex) {
			app.errHandler(ex,locMod);
		}
	},
	hideMyMasked : function() {
		var locMod = "utils.hideMyMasked";
		var me = this;
		app.dh('Start','...',locMod);
		try{
			//mask.setMasked(false);
			if (app.currentView) {
				app.currentView.setMasked(false);
				//mask.hide();
				//mask.setMasked(false);
			}
		//Ext.Viewport.setMasked(false);
		}catch(ex){
			app.eh(ex,locMod);	
		}
	},
	doDelay : function(delay, thisFunction) {
		this.execDelay(thisFunction,delay);
		
	},
	execDelay : function(thisFunction, delay) {
		if (!delay) { delay = 5000; }
		var delayProcess = Ext.create('Ext.util.DelayedTask', thisFunction, this);

		delayProcess.delay(delay);
	},
	dialogMesg: function(title,msg,thisFunction) {
		Ext.Msg.confirm(title,msg,thisFunction);
	},
	getDefaultServer: function() {
		var system = mhelpdesk.view.System;
		return system.getDefaultServer(); //  "http://localhost/sc-now/"; //
		//return 'http://localhost/hdesk/'; //  "http://localhost/sc-now/"; //
	},
	getGLatLng: function(lat, lng) {
		return new google.maps.LatLng(lat,lng);	
	},
	tickerShow: function() {
		var ticker = function() {
			me._tickerTask = Ext.create('Ext.util.DelayedTask',
					function() {
						
						ticker.call(this);
					}, me);
			me._tickerTask.delay(10000);

		}

		ticker();
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
	getCardType: function() {
		var selectOptions=[
				{ value: 'master', iconCls: '<i class="fa fa-cc-mastercard fa-2x" aria-hidden="true"></i>',  text:'Master Card'},
				{ value: 'visa',  iconCls: '<i class="fa fa-cc-visa fa-2x" aria-hidden="true"></i>', text:'Visa Card'},
				{ value: 'amex', iconCls: '<i class="fa fa-cc-amex fa-2x" aria-hidden="true"></i>', text:'American Express Card'},
				{ value: 'diners', iconCls: '<i class="fa fa-cc-diners-club fa-2x" aria-hidden="true"></i>', text:'Diners Club'},
				{ value: 'paypal', iconCls: '<i class="fa fa-cc-paypal fa-2x" aria-hidden="true"></i>', text:'PayPal'},
				{ value: 'maybank2u', iconCls: '<i class="fa fa-credit-card-alt fa-2x" aria-hidden="true"></i>', text:'Maybank2u'}
			];
		return selectOptions;	
		
	},
	getCardIcon: function(card) {
		var selectOptions = this.getCardType();
		for (var i = 0; i < selectOptions.length; i++) {
            var opt = selectOptions[i];
            if (opt.value === card) {
                return opt.iconCls;
            }
        }
        return '';
		
	},
	execAjax: function(url, params, successCallback, failCallback) {
		Ext.Ajax.request({
			url : utils.getDefaultServer()+url,
			method : 'post',
			params : params,
			success : successCallback,
			failure : failCallback
		});	
	},
	setInstruction : function(thisField, label, prefix, reset) {
		var me =this;
		var locale = mhelpdesk.view.Locale;
		try {
			if (!reset) reset="";
			thisField.parent.setInstructions(locale.getText(prefix)+" "+label);
			this.doDelay(3000, function() {
				thisField.parent.setInstructions(reset);
			});
		} catch (ex) {
			console.error(ex);
		}
	},
	sprintf: function( format, args )
	{
	  for( var i=0; i < args.length; i++ ) {
	    format = format.replace( /%s/, args[i] );
	  }
	  return format;
	}
});