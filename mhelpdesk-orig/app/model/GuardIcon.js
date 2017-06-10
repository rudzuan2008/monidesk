Ext.define('mhelpdesk.model.GuardIcon', {
	extend: 'Ext.data.Model',
	config: {
		identifier : {
			type : 'uuid',
			isUnique : true
		},
		fields: ['no', 'icon', 'title', 'description', 'action'],

		proxy: {
			type: 'localstorage',
			id: 'guardiconModel' // 'simple-login-data'
		}
	}
});