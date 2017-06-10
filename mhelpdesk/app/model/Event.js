Ext.define("mhelpdesk.model.Event", {
	extend : "Ext.data.Model",
	requires : 'Ext.Date',
	config : {
		identifier : {
			type : 'uuid',
			isUnique : true
		},
		fields : [ 'event_id', 'company_id', 'title', 'create_by', 'verify_by',
				'approve_by', 'username', 'period', 'stime', 'etime', 'img_url', {
					name : 'fdate',
					type : 'string'
				}, {
					name : 'sdate',
					type : 'date',
					dateFormat : 'Y-m-d'
				}, {
					name : 'edate',
					type : 'date',
					dateFormat : 'Y-m-d'
				}, {
					name : 'sdatetime',
					type : 'date'
				}, {
					name : 'edatetime',
					type : 'date'
				}, 'duration', 'status', 'description', 'note', 'indicator',
				'notify_flag', 'category_id', 'locale', 'bg_color',
				{name : 'created', type: 'date', dateFormat : 'Y-m-d H:i:s'},
				{name : 'updated', type: 'date', dateFormat : 'Y-m-d H:i:s'}
				],
		proxy : {
			type : 'localstorage',
			id : 'eventModel'
		}
	}
});
