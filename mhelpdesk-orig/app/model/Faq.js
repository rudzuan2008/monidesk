Ext.define("mhelpdesk.model.Faq", {
	extend : "Ext.data.Model",
	requires : 'Ext.Date',
	config : {
		identifier : {
			type : 'uuid',
			isUnique : true
		},
		fields : [ 
		          {name: 'faq_id', type: 'int'}, 
		          {name: 'topic', type: 'string'}, 
		          {name: 'answer', type: 'string'}, 
		          {name: 'question', type: 'string'}, 
		          {name: 'isactive', type: 'int'}, 
		          {name: 'category', type: 'string'}, 
		          {name: 'language', type: 'string'} 
		         ],
		proxy : {
			type : 'localstorage',
			id : 'faqModel'
		}
	}
});
