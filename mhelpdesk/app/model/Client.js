Ext.define("mhelpdesk.model.Client", {
	extend : "Ext.data.Model",
	requires : 'Ext.Date',
	config : {
		identifier : {
			type : 'uuid',
			isUnique : true
		},
		fields : [ 
		          {name: 'client_id', type: 'int'}, 
		          {name: 'client_email', type: 'string'}, 
		          {name: 'client_firstname', type: 'string'}, 
		          {name: 'client_lastname', type: 'string'}, 
		          {name: 'isactive', type: 'int'}, 
		          {name: 'client_mobile', type: 'string'}, 
		          {name: 'client_organization', type: 'string'}, 
		          {name: 'client_phone', type: 'string'}, 
		          {name: 'client_product', type: 'string'}
		         ],
		proxy : {
			type : 'localstorage',
			id : 'clientModel'
		}
	}
});
