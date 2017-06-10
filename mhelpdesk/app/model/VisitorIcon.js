Ext.define('mhelpdesk.model.VisitorIcon', {
	extend: 'Ext.data.Model',
	config: {
		identifier : {
			type : 'uuid',
			isUnique : true
		},
		fields: ['no', 'icon', 'title', 'description', 'action'],

		proxy: {
			type: 'localstorage',
			id: 'visitoriconModel' // 'simple-login-data'
		}
	}
});