Ext.define("mhelpdesk.model.Product", {
	extend : "Ext.data.Model",
	requires : 'Ext.Date',
	config : {
		identifier : {
			type : 'uuid',
			isUnique : true
		},
		fields : [ 'asset_id', 'isactive', 'company_id', 'category_id', 'name', 'description', 'state_id', 'postcode', 'category', 'manufacturer', 
			'location', 'location_type', 'client_id', 'model', 'serial_no', 'unit_no', 'price', 'date_purchase', 'created', 'updated'],
		proxy : {
			type : 'localstorage',
			id : 'productModel'
		}
	}
});
