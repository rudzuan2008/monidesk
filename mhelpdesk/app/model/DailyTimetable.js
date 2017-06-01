Ext.define("mhelpdesk.model.DailyTimetable", {
	extend : "Ext.data.Model",
	requires : 'Ext.Date',
	config : {
		identifier : {
			type : 'uuid',
			isUnique : true
		},
		fields : [ 
		          {name: 'timetable_id', type: 'int'}, 
		          {name: 'school_id', type: 'int'}, 
		          {name: 'period', type: 'int'}, 
		          {name: 'fdate', type: 'string'}, 
		          {name: 'stime', type: 'string'}, 
		          {name: 'etime', type: 'string'}, 
		          {name: 'sort_field', type: 'int'}, 
		          {name: 'duration', type: 'int'}, 
		          {name: 'status', type: 'string'}, 
		          {name: 'description', type: 'string'}, 
		          {name: 'subject', type: 'string'}, 
		          {name: 'code', type: 'string'}, 
		          {name: 'indicator', type: 'string'}, 
		          {name: 'locale', type: 'string'}, 
		          {name: 'bg_color', type: 'string'}
		         ],
		proxy : {
			type : 'localstorage',
			id : 'dailyTimetableModel'
		}
	}
});
