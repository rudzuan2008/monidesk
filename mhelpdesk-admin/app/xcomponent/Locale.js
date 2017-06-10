Ext.define('wtadmin.component.Locale', {
	singleton : true,
	_lang: 'en',
	config : {
		my : {
			General : {
				Logout: 'Daftar Keluar',
				Login: 'Daftar Masuk',
				Confirmation : 'Kepastian',
				ExitQuestion : 'Adakah anda ingin keluar?'
				
			}
		},
		en : {
			General : {
				Logout: 'Signing Out',
				Login: 'Signing In',
				Confirmation : 'Confirmation',
				ExitQuestion : 'Are you sure you want to exit?'
				
			}
		}
	},
	localize : function(locale) {
		var locMod = "locale.localize";
		if (!locale) {
			locale = 'en';
		}
		this._lang=locale;
		app.debugHandler('APPLY LOCALE' , locale, locMod);
		var translations = this.config[locale];
		for (var view in translations) {
			console.log(view);
			if (wtadmin.view[view]) {
				Ext.apply(wtadmin.view[view].prototype, translations[view]);
			}
		}
	},
	getText : function(field, locale) {
		var locMod = "locale.getText";
		if (!locale) {
			locale = 'en';
		}
		app.debugHandler('GET TEXT' , locale, locMod);
		try {
			var translations = this.config[locale];
			var commonText = translations['General'];
			if (commonText[field]) {
				return commonText[field];
			} else {
				return field;
			}
		} catch (ex) {
			app.errHandler(ex,locMod);
			return field;
		}
	}
});