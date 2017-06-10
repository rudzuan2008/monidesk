system = mhelpdesk.view.System;
Ext.define('mhelpdesk.store.RemoteSosTicket', {
	extend : 'Ext.data.Store',
	requires: [
        'Ext.data.proxy.JsonP'
    ],
    config: {
        storeId : 'remoteSosTicketStore',
        model: "mhelpdesk.model.Ticket",
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