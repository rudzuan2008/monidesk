Ext.define("mhelpdesk.model.ClientUnit", {
	extend : "Ext.data.Model",
	requires : 'Ext.Date',
	config : {
		identifier : {
			type : 'uuid',
			isUnique : true
		},
		fields : ['client_id', 'fullname', 'support_staff', 'noautoresp', 'client_email', 'client_firstname', 'client_lastname', 'client_password', 'client_organization', 
			'client_dept', 'client_product', 'client_phone', 'client_mobile', 'client_fax', 'client_address', 'client_postcode', 'client_state_id', 'client_isactive', 
			'client_created', 'client_lastlogin', 'company_id', 'asset_name', 'asset_address', 'asset_unit', 'unitowner'],
		proxy : {
			type : 'localstorage',
			id : 'clientUnitModel'
		}
	}
});
