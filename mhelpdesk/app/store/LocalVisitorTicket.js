Ext.define('mhelpdesk.store.LocalVisitorTicket', {
	extend : "Ext.data.Store",
	config : {
		storeId : 'localVisitorTicketStore',
		model : "mhelpdesk.model.TicketVisitor",
		grouper : {
			groupFn : function(record) {
				return locale.getText("Status") +":" + locale.getText(record.get('status'));
			},
			direction:'ASC',
			sortProperty: 'ticket_id'
		}

	}
});