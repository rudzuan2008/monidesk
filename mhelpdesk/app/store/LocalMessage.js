Ext.define('mhelpdesk.store.LocalMessage', {
	extend : "Ext.data.Store",
	config : {
		storeId : 'localMessageStore',
		model : "mhelpdesk.model.Message",
		sorters : 'created, msg_id',
		grouper : {
			groupFn : function(record) {
				//var locale = wbiztech.view.Locale;
            	//return locale.getText('Date') + ":" + locale.getText(Ext.Date.format(record.get('updated_at'), 'l')) + ","+Ext.Date.format(record.get('updated_at'), 'd F Y'); // Ext.Date.format(record.get('sdate'), 'd-m-Y');

				//return locale.getText("Status") +":" + locale.getText(record.get('indicator'));
				//return '<span style="font-size:large;font-weight:bold;color:black">'+ record.get('ticket') +'</span><br /><br />';
			},
			direction:'DESC',
			sortProperty: 'created, msg_id'
		}

	}
});