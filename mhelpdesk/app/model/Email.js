Ext.define("mhelpdesk.model.Email", {
	extend : "Ext.data.Model",
	requires : 'Ext.Date',
	config : {
		identifier : {
			type : 'uuid',
			isUnique : true
		},
		fields : [ 
		          {name: 'email_id', type: 'int'}, 
		          {name: 'noautoresp', type: 'int'}, 
		          {name: 'priority_id', type: 'int'}, 
		          {name: 'dept_id', type: 'int'}, 
		          
		          {name: 'email', type: 'string'}, 
		          {name: 'name', type: 'string'}, 
		          {name: 'phone', type: 'string'}, 
		          {name: 'userid', type: 'string'}, 
		          {name: 'userpass', type: 'string'}, 
		          
		          {name: 'mail_active', type: 'int'}, 
		          {name: 'mail_host', type: 'string'}, 
		          {name: 'mail_protocol', type: 'string'}, 
		          {name: 'mail_encryption', type: 'string'}, 
		          {name: 'mail_port', type: 'int'},
		          {name: 'mail_fetchfreq', type: 'int'}, 
		          {name: 'mail_fetchmax', type: 'int'},
		          {name: 'mail_delete', type: 'int'},
		          {name: 'mail_errors', type: 'int'},
		          {name: 'mail_lasterror', type: 'date'},
		          {name: 'mail_lastfetch', type: 'date'},
		          {name: 'smtp_active', type: 'int'},
		          {name: 'smtp_host', type: 'string'},
		          {name: 'smtp_port', type: 'int'},
		          {name: 'smtp_secure', type: 'int'},
		          {name: 'smtp_auth', type: 'int'},
		          {name: 'created', type: 'date'},
		          {name: 'updated', type: 'date'}	          
		         ],
		proxy : {
			type : 'localstorage',
			id : 'emailModel'
		}
	}
});
