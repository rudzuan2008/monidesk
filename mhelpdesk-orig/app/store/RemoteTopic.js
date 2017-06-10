system = mhelpdesk.view.System;
Ext.define('mhelpdesk.store.RemoteTopic', {
	extend : 'Ext.data.Store',
	requires: [
        'Ext.data.proxy.JsonP'
    ],
    config: {
        storeId : 'remoteTopicStore',
        model: "mhelpdesk.model.Topic",
        proxy: {
            type: 'jsonp',
            callbackKey: 'callback',
            url: system.getDefaultServer() + 'remote/data_topic.php',
            reader: {
                type: 'json',
                rootProperty: 'data',
                successProperty: 'success'
            }
		}
    }
});