Ext.define('mhelpdesk.store.LocalNotification', {
    extend: "Ext.data.Store",
    config: {
        storeId: 'localNotificationStore',
        model: "mhelpdesk.model.Notification",
        sorters: 'sdate',
        grouper: {
            groupFn: function(record) {
            	switch (record.get('locale')) {
				case 'my':
					return '<i class="fa fa-calendar" aria-hidden="true"></i>&nbsp;Tarikh Makluman: '+ Ext.Date.format(record.get('sdate'), 'd-m-Y');
					break;
				case 'en':
					return '<i class="fa fa-calendar" aria-hidden="true"></i>&nbsp;Notification Date: '+ Ext.Date.format(record.get('sdate'), 'd-m-Y');
					break;
				case 'ch':
					return '<i class="fa fa-calendar" aria-hidden="true"></i>&nbsp;Tarikh Makluman: '+ Ext.Date.format(record.get('sdate'), 'd-m-Y');
					break;
				default:
					return '<i class="fa fa-calendar" aria-hidden="true"></i>&nbsp;Tarikh Makluman: '+ Ext.Date.format(record.get('sdate'), 'd-m-Y');
					break;

				}
                
            },
            sortProperty: 'sdatetime'
        }
    }
});