Ext.define("mhelpdesk.model.Page", {
	extend : "Ext.data.Model",
	requires : 'Ext.Date',
	config : {
		identifier : {
			type : 'uuid',
			isUnique : true
		},
		fields : [ 
			'page_id', 'code', 'isactive', 'dept_id', 'title_en', 'title_ms_MY', 'description_en', 'description_ms_MY', 'logo', 'bg_title', 'bg_page', 'rows', 
			'created', 'updated', 'company_id'         
		         ],
		proxy : {
			type : 'localstorage',
			id : 'PageModel'
		}
	}
});