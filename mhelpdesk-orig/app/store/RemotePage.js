system = mhelpdesk.view.System;
Ext.define('mhelpdesk.store.RemotePage', {
	extend : 'Ext.data.Store',
	requires: [
        'Ext.data.proxy.JsonP'
    ],
    config: {
        storeId : 'remotePageStore',
        model: "mhelpdesk.model.Page",
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