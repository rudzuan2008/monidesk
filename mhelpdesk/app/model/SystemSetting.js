Ext.define("mhelpdesk.model.SystemSetting", {
	extend : "Ext.data.Model",
	config : {
		identifier : {
			type : 'uuid',
			isUnique : true
		},
		fields : [{name: 'sys_id', type: 'int'}, 
		          {name: 'title', type: 'string'},
		          {name: 'members', type: 'string'},
		          {name: 'locale', type: 'string'}, 
		          {name: 'ticker_interval', type: 'int'},
		          {name: 'sound', type: 'int'},
		          {name: 'notice', type: 'string'},
		          {name: 'color_true', type: 'string'}, 
		          {name: 'color_false', type: 'string'},
		          {name: 'email', type: 'string'},
		          {name: 'phone', type: 'string'},
		          {name: 'screen_mode', type: 'int'},
		          {name: 'theme', type: 'string'},
		          {name: 'company', type: 'string'}
		          ],
		proxy : {
			type : 'localstorage',
			id : 'systemSettingModel'
		}
	}
});
