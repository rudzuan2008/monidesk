Ext.define('mhelpdesk.view.ticket.SosList', {
	extend : 'Ext.dataview.List',
	xtype : 'sosList',
	requires : ['mhelpdesk.model.Ticket'],
	config : {
		itemId : 'sosList',
		cls: 'p-sos-list',
		store : 'localAllClientStore',
		scrollToTopOnRefresh: true,
		striped: true,
		store : 'localSosTicketStore',
		grouped : true,
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
				+ '<span style="font-weight:bold;font-size: 1em;">' 
				+ '<span class="fa-stack fa-lg">'
  				+ '		<i class="fa fa-square-o fa-stack-2x"></i>'
  				+ '		<i class="fa fa-fire fa-stack-1x r-red-color"></i>'
				+ '</span>{[this.getLocaleText(values.locale,"Ticket")]} #{ticketID} ({status} - {[this.isAnswered(values.isanswered)]})' 
				+ '</span><br />'
				+ '<span style="font-size: .85em;">'
				+ '{[this.getLocaleText(values.locale,"DateCreate")]} : {created:date("d-m-Y H:i")}&nbsp;'
				+ '{subject}'
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
		var locMod = 'sosList-initialize';
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
