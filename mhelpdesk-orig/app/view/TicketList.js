Ext.define('mhelpdesk.view.TicketList', {
	extend : 'Ext.dataview.List',
	xtype : 'ticketList',
	requires : ['mhelpdesk.model.Ticket'],
	config : {
		itemId : 'ticketList',
		store : 'localTicketStore',
		cls : 'view_ticket',
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
				+ '<span style="font-weight:bold;">{[this.getLocaleText(values.locale,"Ticket")]} #{ticketID} ({status}-{[this.isAnswered(values.isanswered)]})</span><br />'
				+ '<span style="">'
				+ '{[this.getLocaleText(values.locale,"DateCreate")]} : {created:date("d-m-Y H:i")}<br>'
				+ '{subject}<br>'
				+ '</span>'
				+ '</div>', {
				compile : true,
				isAnswered : function(isanswered) {
					var locale = mhelpdesk.view.Locale;
					if (isanswered==0) {
						return locale.getText("NotAnswered");
					}else{
						return locale.getText("Answered");
					}
				},
				getLocaleText : function(lang, text) {
						var locale = mhelpdesk.view.Locale;
						return locale.getText(text);
				}
		}),
		listeners : {
			initialize : function() {
				var me = this;
				var locMod = 'ticketList-initialize';
				try {
					var locale = mhelpdesk.view.Locale;
					me.setEmptyText('<div class="no-data">'
							+ locale.getText('NoRecord') + '</div>');
				} catch (ex) {
					console.error(ex);
					//mhelpdesk.app.fireEvent('ErrorPage', locMod, ex);
				}
				
			}
		}
//		listeners : [{
//					fn : 'onInit',
//					event : 'initialize'
//				}]
	}
//	initialize : function() {
//		var me = this;
//		var locMod = 'ticketList-initialize';
//		try {
//			var locale = mhelpdesk.view.Locale;
//			me.setEmptyText('<div class="no-data">'
//					+ locale.getText('NoRecord') + '</div>');
//		} catch (ex) {
//			console.error(ex);
//			mhelpdesk.app.fireEvent('ErrorPage', locMod, ex);
//		}
//
//	},
//	onInit : function() {
//		var me = this;
//		var locMod = 'ticketList-initialize';
//		try {
//			var locale = mhelpdesk.view.Locale;
//			me.setEmptyText('<div class="no-data">'
//					+ locale.getText('NoRecord') + '</div>');
//		} catch (ex) {
//			console.error(ex);
//			//mhelpdesk.app.fireEvent('ErrorPage', locMod, ex);
//		}
//
//	}
});
