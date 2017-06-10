Ext.define("mhelpdesk.model.Notification", {
	extend : "Ext.data.Model",
	config : {
		identifier : {
			type : 'uuid',
			isUnique : true
		},
		fields : [ 
		'notification_id', 
		'company_id',
		'staff_id',
		'client_id',
		'event_id',
		'title', 
		'ftitle',
		'message', 
		'file_path', 
		'img_url',
		'fmessage', 
		'create_by', 
		'verify_by', 
		'approve_by',
		'username', 
		'stime', 
		{
			name : 'fdate',
			type : 'string'
		}, {
			name : 'sdate',
			type : 'date',
			dateFormat : 'Y-m-d'
		}, 'etime', {
			name : 'edate',
			type : 'date',
			dateFormat : 'Y-m-d'
		}, {
			name : 'sdatetime',
			type : 'date'
		}, {
			name : 'edatetime',
			type : 'date'
		}, 'duration', 'status', 'description', 'fdescription',
		'indicator', 'notify_flag', 'event_id', 'note', 'fnote',
		'accept_flag', 'status_reply', 'indicator_reply', 'locale',
		'mesg_type',
		{name : 'created', type: 'date', dateFormat : 'Y-m-d H:i:s'},
		{name : 'updated', type: 'date', dateFormat : 'Y-m-d H:i:s'}
		],
		identifier : 'uuid',
		proxy : {
			type : 'localstorage',
			id : 'notificationModel'
		}
	}
});
