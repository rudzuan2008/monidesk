Ext.define('mhelpdesk.store.RemoteNotification', {
	extend : 'Ext.data.Store',
	requires: [
        'Ext.data.proxy.JsonP'
    ],
    config: {
        storeId : 'remoteNotificationStore',
        model: "mhelpdesk.model.Notification",
        proxy: {
            type: 'jsonp',
            callbackKey: 'callback',
            url: system.getDefaultServer() + 'remote/data_notification.php',
            reader: {
                type: 'json',
                rootProperty: 'data',
                successProperty: 'success'
            }
        }
    }
	
	
//	config : {
//		model: "mhelpdesk.model.Notification",
//		fields : [{
//					name : 'first_name'
//				}, {
//					name : 'last_name'
//				}],
//		storeId : 'remoteNotificationStore',
//		autoLoad : false,
//		proxy : {
//			type : 'ajax',
//			url : 'api/myPHPfile.php',
//			reader : {
//				type : 'json',
//				rootProperty : 'data'
//			}
//		}
//	}
});