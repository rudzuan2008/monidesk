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
		          {name: 'company', type: 'string'},
		          {name: 'company_id', type: 'int'},
		          {name: 'login_flag', type: 'int'},
		          {name: 'login_remember', type: 'int'},
		          {name: 'last_clientid', type: 'int'},
		          {name: 'company_name', type: 'string'},
		          {name: 'user', type: 'string'},
		          {name: 'fullname', type: 'string'},
		          {name: 'group', type: 'string'}
		          ],
		proxy : {
			type : 'localstorage',
			id : 'systemSettingModel'
		}
	}
});
