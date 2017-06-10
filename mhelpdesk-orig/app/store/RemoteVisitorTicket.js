system = mhelpdesk.view.System;
Ext.define('mhelpdesk.store.RemoteVisitorTicket', {
	extend : 'Ext.data.Store',
	requires: [
        'Ext.data.proxy.JsonP'
    ],
    config: {
        storeId : 'remoteVisitorTicketStore',
        model: "mhelpdesk.model.TicketVisitor",
        proxy: {
            type: 'jsonp',
            callbackKey: 'callback',
            url: system.getDefaultServer() + 'remote/data_ticket.php',
            reader: {
                type: 'json',
                rootProperty: 'data',
                successProperty: 'success'
            }
		}
    }
});