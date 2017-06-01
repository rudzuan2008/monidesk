Ext.define('mhelpdesk.view.visitor.VisitorResidentList', {
	extend : 'Ext.dataview.List',
	xtype : 'visitorResidentList',
	requires : ['mhelpdesk.model.TicketVisitor'],
	config : {
		itemId : 'visitorResidentList',
		cls: 'p-visitorresident-list',
		scrollToTopOnRefresh: true,
		striped: true,
		store : 'localVisitorTicketStore',
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
  				+ '		<i class="fa {[this.getIcon(values.topic_id)]} fa-stack-1x"></i>'
				+ '</span>{[this.getLocaleText(values.locale,"Date")]} : {created:date("d-m-Y H:i")} ({status})' 
				+ '</span><br />'
				+ '<span style="font-size: .85em;">'
				+ '{subject}&nbsp;'
				+ '{[this.getLocaleText(values.locale,"Ticket")]} #{ticketID}'
				+ '</span>'
				+ '</div>', {
				compile : true,
				getIcon : function(topic_id) {
					
					if (topic_id==5) {
						return 'fa-truck';
					}else{
						return 'fa-user';
					}
				},
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
		var locMod = 'visitorResidentList-initialize';
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
