Ext.define('mhelpdesk.view.NoticeTicketFail', {
	extend : 'Ext.form.Panel', // 'Ext.navigation.View',
	xtype : 'noticeTicketFail',
	requires : ['Ext.TitleBar'],
	config : {
		itemId : 'noticeTicketFail',
		cls : 'p-notice-fail-ticket',
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
			var toolbarOper = Ext.create("Ext.Container", {				
				layout: {
					type: 'hbox',
					pack: 'center',
					align: 'stretch'
				},
				items : [{
					xtype : 'button',
					itemId : 'btnReturnMain',
					name : 'btnReturnMain',
					ui : 'plain',
					cls : 'r-square-button',
					iconAlign : 'top',
					iconCls : 'fa-times',
					//style : 'font-family: "FontAwesome";margin: .5em .5em .5em;padding-left: 5px; width: 80px; text-align: -webkit-center;',
					text : me.txtClose
				}]
			});
			
			me.setItems([{
				xtype : 'toolbar',
				docked : 'bottom',
				ui : 'white',
				layout : {
					type : 'vbox',
					pack : 'top',
					align : 'stretch'
				},
				items : [toolbarOper]
			},{
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