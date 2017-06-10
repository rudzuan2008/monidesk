system = mhelpdesk.view.System;
Ext.define('mhelpdesk.store.RemotePageDetail', {
	extend : 'Ext.data.Store',
	requires: [
        'Ext.data.proxy.JsonP'
    ],
    config: {
        storeId : 'remotePageDetailStore',
        model: "mhelpdesk.model.PageDetail",
        proxy: {
            type: 'jsonp',
            callbackKey: 'callback',
            url: system.getDefaultServer() + 'remote/data_common.php',
            reader: {
                type: 'json',
                rootProperty: 'data',
                successProperty: 'success'
            }
		}
    }
});