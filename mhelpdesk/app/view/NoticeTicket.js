Ext.define('mhelpdesk.view.NoticeTicket', {
	extend : 'Ext.form.Panel', // 'Ext.navigation.View',
	xtype : 'noticeTicket',
	requires : ['Ext.TitleBar'],
	config : {
		itemId : 'noticeTicket',
		title : '',
		user : '',
		email : '',
		ticketID : '',
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
	txtDesc : 'Tiket Permohonan Bantuan BERJAYA diwujudkan.',
	txtPara1 : 'Terima kasih kerana telah menghubungi kami',
	txtPara2 : 'Tiket Permohonan Bantuan',
	txtPara3 : 'telah diwujudkan dan wakil kami akan menghubungi tuan dalam masa terdekat.</p>',
	txtPara4 : 'Kami juga telah emel ke <b><a href="mailto://',
	txtPara5 : 'nombor rujukan Tiket Permohonan Bantuan',
	txtPara6 : 'Nombor rujukan Tiket Permohonan Bantuan ini dan alamat emel tuan adalah diperlukan untuk tuan menyemak status dan kemajuan permohonan tuan.',
	txtPara7 : 'Sila ikut arahan di emel tersebut sekiranya tuan ingin menambah maklumat atau komen mengenai isu yang sama.',
	txtThanks : 'Terima Kasih',
	txtHelpdesk : 'Meja Bantuan EDC',
	initialize : function() {
		var me = this;
		try {
			var system = mhelpdesk.view.System;
			var strHtml = "";
			var user = me.getUser();
			var email = me.getEmail();
			var ticketID = me.getTicketID();
			strHtml='<div style="margin:10px 10px 10px 20px;height:100%;">'
				+ user + ',<br><br><p>'
				+ me.txtPara1 + '<br><br>'
				+ me.txtPara2 +' ('+ticketID+') '
				+ me.txtPara3 + '<br><br><p>'
				+ me.txtPara4 + email+'">'+email+'</a></b>,'
				+ me.txtPara5 + ' ('+ticketID+'). '
				+ me.txtPara6 + '</p><br><br><p>'
				+ me.txtPara7 +'</p><br><br>'
				+ me.txtThanks + '<br>'
				+ system.getMembers()
				+ '</div>';
			
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