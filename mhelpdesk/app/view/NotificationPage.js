Ext.define('mhelpdesk.view.NotificationPage', {
	extend: 'Ext.Container', 
	xtype: 'notificationpage',
	requires: [
		'Ext.TitleBar'
	],
	config: {
		itemId: 'notificationpage',
		cls: 'p-notification-page',
		layout: 'fit',
		items: [
        {
			xtype	: 'notification',
			style	: 'background-color: rgba(0, 0, 0, 0.23); border: 1px solid rgba(0, 0, 0, 0.23);cursor: pointer;',
			title	: 'Makluman',
			width	: '100%',
			height	: '100%'
		}
        
        ]
	},
	initialize: function() {
		
	}
});
