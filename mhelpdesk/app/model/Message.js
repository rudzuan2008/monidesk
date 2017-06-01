Ext.define("mhelpdesk.model.Message", {
	extend : "Ext.data.Model",
	requires : 'Ext.Date',
	config : {
		identifier : {
			type : 'uuid',
			isUnique : true
		},
		fields : [ 
		          {name: 'msg_id', type: 'int'}, 
		          {name: 'ticket_id', type: 'int'}, 
		          {name: 'messageId', type: 'string'}, 
		          {name: 'file_key', type: 'string'}, 
		          {name: 'hash', type: 'string'}, 
		          {name: 'msg_type', type: 'string'}, 
		          {name: 'message', type: 'string'}, 
		          {name: 'staff_id', type: 'int'}, 
		          {name: 'staff_name', type: 'string'},  
		          {name: 'headers', type: 'string'}, 
		          {name: 'source', type: 'string'}, 
		          {name: 'ip_address', type: 'string'}, 
		          {name: 'created', type: 'date', dateFormat : 'Y-m-d H:i:s'},
		          {name: 'attachments', type: 'int'}
		          ],
		proxy : {
			type : 'localstorage',
			id : 'messageModel'
		}
	}
});