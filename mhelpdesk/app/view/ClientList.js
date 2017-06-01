Ext.define('mhelpdesk.view.ClientList', {
	extend : 'Ext.dataview.List',
	xtype : 'clientList',
	requires : ['mhelpdesk.model.Client'],
	config : {
		itemId : 'clientList',
		store : 'localClientStore',
		grouped : false,
		emptyText : '<div class="no-data">No Data found.</div>',
		plugins: [
	        {
	            xclass: 'Ext.ux.PullRefreshFn',
	            pullText: 'Pull down to refresh!',
	            releaseText : 'Release to refresh',
	            refreshFn: function() { 
	            	var me = this;
	            	try{
	            		var me = this.getList();
		            	var store = this.getList().getStore();
		            	console.warn(this.parent.getItemId()+ "- Refresh data list ...");
		            	me.fireEvent('onRefresh', me, store);
	                //Ext.getStore('ENTER YOUR STORE HERE').load()
	            	}catch(ex){
	            		console.error(ex);
	            	}
	           }
	        }
	    ],
		// onItemDisclosure : true,
		onItemDisclosure : function(record) {
			var me = this;
			me.fireEvent('onItemDisclosure', me, record);
		},

		itemTpl : new Ext.XTemplate(
				'<div class="myContent">'
				+ '<span style="font-weight:bold;">{client_organization}</span><br />'
				+ '<span style="color:blue;">'
				+ '&nbsp;{client_firstname} {client_lastname}<br>'
				+ '&nbsp;<i class="fa fa-envelope-o fa-1x"></i>&nbsp;<a href="mailto://{client_email}">{client_email}</a> <i class="fa fa-phone fa-1x"></i>&nbsp;<a href="tel://{client_phone}">{client_phone}</a>&nbsp;<a href="tel://{client_mobile}">{client_mobile}</a><br>'
				+ '&nbsp;{client_product}'
				+ '</span>'
				+ '</div>', {
				compile : true,
				getLocaleText : function(lang, text) {
						var locale = mhelpdesk.view.Locale;
						return locale.getText(text);
				}
				}),
		listeners : [{
			fn : 'onInit',
			event : 'initialize'
		}, {
			fn : 'onSwipe',
			event : 'swipe',
			element : 'element'
		}]
	},
	onInit : function() {
		var me = this;
		var locMod = 'clientList-initialize';
		try {
			var locale = mhelpdesk.view.Locale;
			me.setEmptyText('<div class="no-data">'
					+ locale.getText('NoRecord') + '</div>');
		} catch (ex) {
			console.error(ex);
			mhelpdesk.app.fireEvent('ErrorPage', locMod, ex);
		}

	}
});
