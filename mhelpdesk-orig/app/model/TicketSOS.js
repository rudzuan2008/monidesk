Ext.define("mhelpdesk.model.TicketSOS", {
	extend : "Ext.data.Model",
	requires : 'Ext.Date',
	config : {
		identifier : {
			type : 'uuid',
			isUnique : true
		},
		fields : [ 
		          {name: 'ticket_id', type: 'int'}, 
		          {name: 'ticketID', type: 'string'}, 
		          {name: 'dept_id', type: 'int'}, 
		          {name: 'dept_name', type: 'string'}, 
		          {name: 'priority_id', type: 'int'}, 
		          {name: 'topic_id', type: 'int'}, 
		          {name: 'staff_id', type: 'int'}, 
		          {name: 'email', type: 'string'}, 
		          {name: 'name', type: 'string'}, 
		          {name: 'subject', type: 'string'}, 
		          {name: 'phone', type: 'string'}, 
		          {name: 'ip_address', type: 'string'}, 
		          {name: 'status', type: 'string'}, 
		          {name: 'source', type: 'string'}, 
		          {name: 'isoverdue', type: 'int'}, 
		          {name: 'isanswered', type: 'int'}, 
		          {name : 'duedate', type: 'date', dateFormat : 'Y-m-d H:i:s'},
		          {name : 'reopened', type: 'date', dateFormat : 'Y-m-d H:i:s'},
		          {name : 'closed', type: 'date', dateFormat : 'Y-m-d H:i:s'},
		          {name : 'lastmessage', type: 'date', dateFormat : 'Y-m-d H:i:s'},
		          {name : 'firstresponse', type: 'date', dateFormat : 'Y-m-d H:i:s'},
		          {name : 'lastresponse', type: 'date', dateFormat : 'Y-m-d H:i:s'},
		          {name : 'created', type: 'date', dateFormat : 'Y-m-d H:i:s'},
		          {name : 'updated', type: 'date', dateFormat : 'Y-m-d H:i:s'},
		          {name: 'topic', type: 'string'}, 
		          {name: 'lock_id', type: 'int'}, 
		          {name: 'priority_desc', type: 'string'}, 
		          {name : 'fcreated', type: 'string'},
		          'client_id','asset_id','asset_name', 'asset_address', 'asset_unit'
		         ],
		proxy : {
			type : 'localstorage',
			id : 'ticketSOSModel'
		}
	}
});