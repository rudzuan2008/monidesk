Ext.define('mhelpdesk.view.EventPage', {
	extend: 'Ext.Container', 
	xtype: 'eventpage',
	requires: [
		'Ext.TitleBar'
	],
	config: {
		itemId : 'eventpage',
		cls: 'p-event-page',
		items: [
        { 	xtype: 'panel', 
        	width: '100%',
            height: '100%',
            padding: 2,
        	items: [
        		{
					xtype	: 'event',
					style	: 'background-color: rgba(0, 0, 0, 0.23); border: 1px solid rgba(0, 0, 0, 0.23);cursor: pointer;',
					title	: 'Makluman',
					width	: '100%',
					height	: '100%'
				}
        	]
        }
        
        ]
	},
	initialize: function() {
		
	}
});
