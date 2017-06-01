Ext.define('mhelpdesk.store.RemoteCommon', {
	extend : 'Ext.data.Store',
	requires: [
        'Ext.data.proxy.JsonP'
    ],
    config: {
        storeId : 'remoteCommonStore',
        model : 'mhelpdesk.model.Config',
        proxy: {
            type: 'jsonp',
            callbackKey: 'callback',
            url: system.getDefaultServer()+'remote/data_common.php',
            reader: {
                type: 'json',
                rootProperty: 'data',
                successProperty: 'success'
            },
            listeners : {
				exception : function(proxy, options, operation) {
					app.eh(operation.getError(),'store.RemoteCommon');
				}
			}
        }
    }
});