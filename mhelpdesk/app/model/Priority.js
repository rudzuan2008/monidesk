Ext.define("mhelpdesk.model.Priority", {
	extend : "Ext.data.Model",
	requires : 'Ext.Date',
	config : {
		identifier : {
			type : 'uuid',
			isUnique : true
		},
		fields : [ 
		          {name: 'priority_id', type: 'int'}, 
		          {name: 'priority', type: 'string'}, 
		          {name: 'priority_desc', type: 'string'}, 
		          {name: 'priority_color', type: 'string'}, 
		          {name: 'priority_urgency', type: 'int'}, 
		          {name: 'ispublic', type: 'int'}
		         ],
		proxy : {
			type : 'localstorage',
			id : 'priorityModel'
		}
	}
});
