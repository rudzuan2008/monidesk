Ext.define('mhelpdesk.view.client.OccupantList', {
	extend : 'Ext.dataview.List',
	xtype : 'occupantList',
	requires : ['mhelpdesk.model.ClientUnit'],
	config : {
		itemId : 'occupantList',
		cls: 'p-occupant-list',
		store : 'localAllClientStore',
		grouped : false,
		emptyText : '<div class="no-data">No Data found.</div>',
		scrollToTopOnRefresh: true,
		striped: true,
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
		            	console.warn(store.getStoreId()+ "- Refresh data list ...");
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
				'<div class="r-contact_list">'
				+ '<span style="font-weight:bold;font-size: 1em;"><span class="fa-stack fa-lg">'
  				+ '		<i class="fa fa-square-o fa-stack-2x"></i>'
  				+ '		<i class="fa fa-user fa-stack-1x"></i>'
				+ '</span> {asset_unit} {fullname}</span><br>'
				+ '<div style="color:blue;">'
				+ '<span style="font-size: .65em; font-weight: normal;">&nbsp;<i>{asset_name}</i></span>, '
				+ '<span style="font-size: .65em; font-weight: normal;">&nbsp;<i>{asset_address}</i></span>'
				+ '</div>'
				+'</div>', {
				compile : true,
				getLocaleText : function(lang, text) {
						var locale = mhelpdesk.view.Locale;
						return locale.getText(text);
				}
				}),
		listeners : {
			initialize : function() {
				var me = this;
				var locMod = 'timetableList-initialize';
				try {
					var locale = mhelpdesk.view.Locale;
					me.setEmptyText('<div class="no-data">'
							+ locale.getText('NoRecord') + '</div>');
				} catch (ex) {
					console.error(ex);
					mhelpdesk.app.fireEvent('ErrorPage', locMod, ex);
				}

			}
		}
	}
});
