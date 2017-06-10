Ext.define("mhelpdesk.model.PageDetail", {
	extend : "Ext.data.Model",
	requires : 'Ext.Date',
	config : {
		identifier : {
			type : 'uuid',
			isUnique : true
		},
		fields : [ 
			'page_detail_id', 'page_id', 'isactive', 'dept_id', 'title_en', 'title_ms_MY', 'description_en', 'description_ms_MY', 'row', 'col', 'created', 'updated', 
			'company_id'          
		         ],
		proxy : {
			type : 'localstorage',
			id : 'PageDetailModel'
		}
	}
});