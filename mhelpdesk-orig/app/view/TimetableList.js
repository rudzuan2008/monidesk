Ext.define('mhelpdesk.view.TimetableList', {
	extend : 'Ext.dataview.List',
	alias : 'widget.timetableList',
	requires : ['mhelpdesk.model.DailyTimetable'],
	txtTitle : 'Tajuk',
	txtDuration : 'Tempoh',
	txtDate : 'Tarikh',
	txtTime : 'Masa',
	txtDay : 'hari',
	config : {
		itemId : 'timetableList',
		store : 'localDailyTimetableStore',
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
						+ '<div>{stime}-{etime} {subject}</div><br>'
					+ '</div>', {
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
