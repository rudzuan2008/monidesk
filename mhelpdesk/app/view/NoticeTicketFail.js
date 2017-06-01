Ext.define('mhelpdesk.view.NoticeTicketFail', {
	extend : 'Ext.form.Panel', // 'Ext.navigation.View',
	xtype : 'noticeTicketFail',
	requires : ['Ext.TitleBar'],
	config : {
		itemId : 'noticeTicketFail',
		title : '',
		user : '',
		email : '',
		msg : '',
		scrollable : true,
		pinHeaders : true,
		layout : {
			type : 'vbox',
			align : 'stretch',
			pack : 'top'
		},
		listeners : [{
			fn : 'onSwipe',
			event : 'swipe',
			element : 'element'
		}]
	},
	txtDesc : 'Tiket Permohonan Bantuan GAGAL diwujudkan',
	initialize : function() {
		var me = this;
		try {
			var strHtml = "";
			var user = me.getUser();
			var email = me.getEmail();
			var msg = me.getMsg();
			strHtml='<div style="margin:10px 10px 10px 20px;height:100%;">'
				+ msg 
				+ '</div>';
			//strHtml=msg;
		
			
			me.setItems([{
				xtype : 'fieldset',
				title : me.txtDesc,
				defaults : {
					labelWidth : '25%',
					labelWrap : true,
					minWidth : 100,
					//width : '100%',
					anchor : '100%',
					margin : 5
				},
				items : [{
					itemId : 'bodyText',
					html : strHtml
				}]
			}]);
			
			this.callParent(arguments);
			
		}catch(ex){
			console.error(ex);
		}
	},
	onSwipe : function(e) {
		var me = this;
		console.info(e.direction);
		if (e.direction == "right") {
			me.fireEvent('back', me);
		}

	}
});