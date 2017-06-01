Ext.define("mhelpdesk.model.Topic", {
	extend : "Ext.data.Model",
	requires : 'Ext.Date',
	config : {
		identifier : {
			type : 'uuid',
			isUnique : true
		},
		fields : [ 
		          {name: 'topic_id', type: 'int'}, 
		          {name: 'topic', type: 'string'}, 
		          {name: 'noautoresp', type: 'int'}, 
		          {name: 'priority_id', type: 'int'}, 
		          {name: 'isactive', type: 'int'}, 
		          {name: 'dept_id', type: 'int'}, 
		          {name: 'autoassign_id', type: 'int'}
		         ],
		proxy : {
			type : 'localstorage',
			id : 'topicModel'
		}
	}
});
