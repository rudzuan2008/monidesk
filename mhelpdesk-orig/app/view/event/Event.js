Ext.define('mhelpdesk.view.event.Event', {
	extend : 'Ext.dataview.List',
	alias : 'widget.event',
	requires : ['mhelpdesk.model.Event'],
	config : {
		store : 'localEventStore',
		grouped : true,
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
		            	me.fireEvent('onRefresh', me, store);
	            	}catch(ex){
	            		console.error(ex);
	            	}
	           }
	        }
	    ],
		onItemDisclosure : function (record) {
					var me = this;
					me.fireEvent('onItemDisclosure', me, record);
    			},

		pinHeaders : true,
		itemHeight : 200,
		itemTpl : new Ext.XTemplate(
				'<div class="my-event">'
					+ '<div class="hdr-event">{[this.getTextTitle(values.locale)]}: {title}</div>'
					//+ '<div>'
						+ '<img src="{[this.getImg(values.img_url)]}" class="img-inline-background"></img>'
						+ '<div class="my-Content">{fmessage}</br>'
							+ '<div style="font-size: small;font-style: italic;"><i>{[this.getTextDate(values.locale)]}: {fdate}<br>'
								+ '{[this.getTextTime(values.locale)]}: {stime}-{etime}<br>'
								+ '{[this.getTextPrepareBy(values.locale)]}: {create_by}<br>'
								+ '{[this.getTextDuration(values.locale)]}: {duration} {[this.getTextDay(values.locale)]}<br>'
								+ '{[this.getTextStatus(values.locale)]}: {status_reply}-{indicator_reply}</i>'
							+ '</div><br>'
						+ '</div>'
					//+ '</div>'
				+'</div>', {
					compiled : true,
					getImg : function(img) {
						var path = system.getUrlPicturePath()+'attachments/EVENTS';
						//console.error(path+img);
						if (img=='Invalid File') {
							return system.getPortalServer()+'attachments/default.jpg';
						}else{
							return path+img;
						}
					},
					getTextPrepareBy : function(lang) {
						//console.log(lang);
						var me = this;
						var text;
						// onsole.log(me);
						switch (lang) {
							case 'en' :
								text = "Prepared By";
								break;
							case 'my' :
								text = "Disediakan Oleh";
								break;
							case 'ch' :
								text = "";
								break;
							default :
								text = "Disediakan Oleh";
								break;
						}
						return text;
					},
					getTextStatus : function(lang) {
						//console.log(lang);
						var me = this;
						var text;
						// onsole.log(me);
						switch (lang) {
							case 'en' :
								text = "Status";
								break;
							case 'my' :
								text = "Status";
								break;
							case 'ch' :
								text = "Status";
								break;
							default :
								text = "Status";
								break;
						}
						return text;
					},
					getTextTitle : function(lang) {
						//console.log(lang);
						var me = this;
						var text;
						// onsole.log(me);
						switch (lang) {
							case 'en' :
								text = "Title";
								break;
							case 'my' :
								text = "Tajuk";
								break;
							case 'ch' :
								text = "";
								break;
							default :
								text = "Tajuk";
								break;
						}
						return text;
					},
					getTextDate : function(lang) {
						//console.log(lang);
						var me = this;
						var text;
						// onsole.log(me);
						switch (lang) {
							case 'en' :
								text = "Date";
								break;
							case 'my' :
								text = "Tarikh";
								break;
							case 'ch' :
								text = "";
								break;
							default :
								text = "Tarikh";
								break;
						}
						return text;
					},
					getTextTime : function(lang) {
						//console.log(lang);
						var me = this;
						var text;
						// onsole.log(me);
						switch (lang) {
							case 'en' :
								text = "Time";
								break;
							case 'my' :
								text = "Masa";
								break;
							case 'ch' :
								text = "";
								break;
							default :
								text = "Masa";
								break;
						}
						return text;
					},
					getTextDuration : function(lang) {
						//console.log(lang);
						var me = this;
						var text;
						// onsole.log(me);
						switch (lang) {
							case 'en' :
								text = "Duration";
								break;
							case 'my' :
								text = "Tempoh";
								break;
							case 'ch' :
								text = "";
								break;
							default :
								text = "Tempoh";
								break;
						}
						return text;
					},
					getTextDay : function(lang) {
						//console.log(lang);
						var me = this;
						var text;
						// onsole.log(me);
						switch (lang) {
							case 'en' :
								text = "day(s)";
								break;
							case 'my' :
								text = "hari";
								break;
							case 'ch' :
								text = "";
								break;
							default :
								text = "hari";
								break;
						}
						return text;
					}
				})

	}
});
