Ext.define('mhelpdesk.store.LocalFaq', {
	extend : "Ext.data.Store",
	config : {
		storeId : 'localFaqStore',
		model : "mhelpdesk.model.Faq",
		sorters: [{
            property: 'category',
            direction: 'ASC'
        }],
		sorters : 'category',
		//groupField : 'topic',
		remoteSort : true,
		grouper : {
			groupFn : function(record) {
				//var locale = wbiztech.view.Locale;
            	//return locale.getText('Date') + ":" + locale.getText(Ext.Date.format(record.get('updated_at'), 'l')) + ","+Ext.Date.format(record.get('updated_at'), 'd F Y'); // Ext.Date.format(record.get('sdate'), 'd-m-Y');

				//return locale.getText("Status") +":" + locale.getText(record.get('indicator'));
				return '<span style="font-size:large;font-weight:bold;padding-top: 5px;">'+ record.get('topic') +'</span>';
			},
			direction:'ASC',
			sortProperty: 'category'
		}

	}
});