Ext.define('mhelpdesk.view.Faq', {
	extend : 'Ext.Panel',
	xtype : 'faq',
	requires : [ 'Ext.TitleBar', 'mhelpdesk.view.FaqList' ],
	config : {
		title : 'FAQ',
		itemId : 'faq'
	},
	txtDesc : 'Frequently Asked Questions',
	initialize : function() {
		var me = this;
		var system = mhelpdesk.view.System;
		try {
			this.setItems([ {
				html : me.txtDesc,
				padding : 5,
				style : 'background-color: white; font-weight: bold;'
			}, {
				xtype : 'faqList',
				width : '100%',
				height : '100%'
			} ]);
		} catch (ex) {
			console.error(ex);
		}
	}
});