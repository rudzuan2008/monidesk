Ext.define("mhelpdesk.model.Intercom", {
	extend : "Ext.data.Model",
	requires : 'Ext.Date',
	config : {
		identifier : {
			type : 'uuid',
			isUnique : true
		},
		fields : ['id', 'number', 'ip', 'name'],
		proxy : {
			type : 'localstorage',
			id : 'clientModel'
		}
	}
});
