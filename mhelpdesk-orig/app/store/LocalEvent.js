Ext.define('mhelpdesk.store.LocalEvent', {
    extend: "Ext.data.Store",
    txtTest: 'abc',
    config: {
        storeId: 'localEventStore',
        model: "mhelpdesk.model.Event",
        grouper: {
            groupFn: function(record) {
            	try {
	            	var locale = mhelpdesk.view.Locale;
	            	var strText = locale.getText('Date',record.get('locale'))+ ": " + locale.getText(Ext.Date.format(record.get('sdate'), 'l'),record.get('locale')) + ', ' + Ext.Date.format(record.get('sdate'), 'd F Y');
	            	return strText;
            	}catch(ex){
            		console.error('Store LocalEvent:'+ex);
            		return 'Tarikh: '+Ext.Date.format(record.get('sdate'), 'l, d F Y');
            	}
            }//,
            //sortProperty: 'sdatetime'
        }
    }
});