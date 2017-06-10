Ext.define('mhelpdesk.store.LocalSosTicket', {
	extend : "Ext.data.Store",
	config : {
		storeId : 'localSosTicketStore',
		model : "mhelpdesk.model.TicketSOS",
		grouper : {
			groupFn : function(record) {
				return locale.getText("Status") +":" + locale.getText(record.get('status'));
			},
			direction:'ASC',
			sortProperty: 'ticket_id'
		}

	}
});