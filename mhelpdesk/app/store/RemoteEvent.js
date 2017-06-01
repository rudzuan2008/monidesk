Ext.define('mhelpdesk.store.RemoteEvent', {
	extend : 'Ext.data.Store',
	requires: [
        'Ext.data.proxy.JsonP'
    ],
    config: {
        storeId : 'remoteEventStore',
        model: "mhelpdesk.model.Event",
        proxy: {
            type: 'jsonp',
            callbackKey: 'callback',
            url: system.getDefaultServer() + 'remote/data_event.php',
            reader: {
                type: 'json',
                rootProperty: 'data',
                successProperty: 'success'
            }
        }
    }
});