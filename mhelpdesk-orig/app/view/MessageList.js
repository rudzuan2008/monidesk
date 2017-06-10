Ext.define('mhelpdesk.view.MessageList', {
	extend : 'Ext.dataview.List',
	alias : 'widget.messageList',
	xtype : 'messageList',
	requires : ['mhelpdesk.model.Message'],
	txtMessageListHeader : 'Turutan Maklumbalas',
	txtReply : 'Jawapan',

	config : {
		itemId : 'messageList',
		title : 'Turutan Maklumbalas',
		store : 'localMessageStore',
		height : '100%',
		//layout : 'fit',
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
	    onItemDisclosure : false,
	    disableSelection: true,
	    scrollToTopOnRefresh : false,
	    cls : 'clshistoryfeedback',
		itemTpl : new Ext.XTemplate(
				'<div class="FEEDBACK-CONTENT">',
				'<tpl if="this.isUser(staff_id) == true">',				
				'	<img style="float: left;width: 28px;" src="images/user_comment.png?s=52&d=mm" />',
				'	<div class="triangle-right left">',
				'	<span class="nickname">Me ({created:date("d-m-Y H:i")}) : <br>',
				'	<span style="font-weight: normal;">{message}',
				'		<tpl if="this.hasAttachment(attachments) == true">',
				'			<br><span style="color:green;cursor: pointer;text-align: right;"><a href="{[this.getDefaultServer()]}mattachment.php?id={ticket_id}&ref={hash}">',
				'					<i accessKey="{ticket_id}" class="fa fa-paperclip fa-lg"></i>',
				'					&nbsp;{[this.getLocaleText(values.locale,"Attachment")]}</a>',
				'				</span>',				
				'		</tpl>',
				'	</span>',
				'	</span>',
				'	</div>',
				'<tpl else>',
				'	<img style="position: absolute; top: 10px; right: 10px;width: 28px;" src="images/user_comment.png?s=52&d=mm" />',
				'	<div class="triangle-right right">',
				'	<span class="nickname">{staff_name} ({created:date("d-m-Y H:i")}) : <br>',
				'	<span style="font-weight: normal;">{message}',
				'		<tpl if="this.hasAttachment(attachments) == true">',
				'			<br><span style="color:green;cursor: pointer;text-align: right;"><a href="{[this.getDefaultServer()]}mattachment.php?id={ticket_id}&ref={hash}">',
				'					<i accessKey="{ticket_id}" class="fa fa-paperclip fa-lg"></i>',
				'					&nbsp;{[this.getLocaleText(values.locale,"Attachment")]}</a>',
				'				</span>',
				'		</tpl>',
				'	</span>', 
				'	</span>', 
				'	</div>', 
				'</tpl>', 
 				'</div>',
					{
					compiled : true,
					getDefaultServer :function() {
						var system = mhelpdesk.view.System;
						return system.getDefaultServer();
					},
					getLocaleText : function(lang, text) {
						var locale = mhelpdesk.view.Locale;
						var system = mhelpdesk.view.System;
						return locale.getText(text,system.getLanguage());
					},
					isUser : function(staff_id) {
						return staff_id == 0;
					},
					hasAttachment : function(attachments) {
						// console.log("note"+note);
						if (attachments > 0) {
							return true;
						} else {
							return false;
						}
					},
					hasNotification : function(notification_id) {
						if (!notification_id||notification_id != "") {
							return true;
						} else {
							return false;
						}
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
		var locMod = 'messageList-initialize';
		try {
			var locale = mhelpdesk.view.Locale;
			me.setEmptyText('<div class="no-data">'
					+ locale.getText('NoRecord') + '</div>');
		} catch (ex) {
			console.error(ex);
			//mhelpdesk.app.fireEvent('ErrorPage', locMod, ex);
		}

	},
	onSwipe : function(e) {
		var me = this;
		console.info(e.direction);
		if (e.direction == "right") {
			//BUG can't fire back from list
			
			//me.fireEvent('back', me);
			//console.error(me.parent.getItemId());
		}
	}
});