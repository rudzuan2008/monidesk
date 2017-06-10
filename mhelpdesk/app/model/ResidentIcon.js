Ext.define('mhelpdesk.model.ResidentIcon', {
	extend: 'Ext.data.Model',
	config: {
		identifier : {
			type : 'uuid',
			isUnique : true
		},
		fields: ['no', 'icon', 'title', 'description', 'action', 'badge', 'image'],

		proxy: {
			type: 'localstorage',
			id: 'residentIconModel' // 'simple-login-data'
		}
	}
});