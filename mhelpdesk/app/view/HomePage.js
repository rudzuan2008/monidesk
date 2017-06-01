Ext.define('mhelpdesk.view.HomePage', {
	extend : 'Ext.Container', // 'Ext.navigation.View',
	xtype : 'homepage',
	requires : ['Ext.TitleBar'],
	config : {
		itemId : 'homepage',
		cls : 'p-landingpage',
		//styleHtmlContent : true,
		// fullscreen: true,
        layout: 'fit',
//		layout : {
//			type : 'vbox',
//			pack : 'center',
//			align : 'start'
//		},
		scrollable: {
		    direction: 'vertical',
		    directionLock: true
		}
		// layout : 'vbox'
		// style : 'background-color: transparent;'
	},
	bgColor : "white",
	setColor : "#f00",
	topPadding : 10,
	txtTraining : "Training / Courses",
	txtTrainingLine : "*Coordinate and training courses organized by state<br>*Entrepreneurial Culture",
	txtGroom : "Groom Big",
	txtGroomLine : "*Upgrading the product to a wider market",
	txtOneStop : "One-Stop Center for Reference",
	txtOneStopLine : "*Reference to entrepreneurs, information on related agencies, the offered initiative schemes",
	txtMarketing : "Marketing",
	txtMarketingLine : "*Johor Entrepreneurs Movement<br>*Entrepreneurs Star Rating<br>*Johor Bumiputera Entreprenenuer Award<br>*Johor Entrepreneur Directory<br>*Flyers Stand - Billboard Reviews<br>*Establishment PUJB Retail SB<br>*Business Matching",
	txtBusiness : "New Business Areas",
	txtBusinessLine : "*Online Business<br>*Cosmetic and retail industry<br>*Argopreneur<br>*Children early education",
	txtIndustry : "Support Industry",
	txtIndustryLine : "*Oil & Gas Industry<br>*Hub Industry Chocolate<br>*Creative Industry<br>*Medical Industry",
	txtWelcome : "Welcome to EDC of Johor Helpdesk-Support Center",
	txtIntro : "EDC provides a one-stop center through a combination of various government agencies in connection with the promotion and development of entrepreneurs for advice, consultation issues, assistance, training and program implementation support to provide fast service, efficient and accurate.",
	txtFeatures : "Features",
	txtColumn1 : "",
	txtColumn2 : "",
	txtColumn3 : "",
	initialize : function() {
		var me = this;
		
		var system = mhelpdesk.view.System;
		
//		var carousel = Ext.create('Ext.Carousel', {
//					
//					width : '100%',
//					height : '100%',
//					indicator : true,
//					direction : 'horizontal',
//					defaultType: 'panel',
//					defaults : {
//						
//					},
//					items : [{
//						title : 'Tab 1',
//						html : '<table width="100%" cellspacing="5px" border=0>'
//								+ '<tr><td><span style="font-weight:bold;">'
//								+ "<div id='subheader'>" + me.txtFeatures + '</div>'
//								+ '</span></td></tr>'
//								+ '<tr><td>'
//								+ me.txtColumn1
//								+ '</td></tr>'
//								+ '</table>'
//					}, {
//						title : 'Tab 2',
//						html : '<table width="100%"" cellspacing="5px" border=0>'
//								+ '<tr><td><span style="font-weight:bold;">'
//								+ "<div id='subheader'>" + me.txtFeatures + '</div>'
//								+ '</span></td></tr>'
//								+ '<tr><td>'
//								+ me.txtColumn2
//								+ '</td></tr>' 
//								+ '</table>'
//					}, {
//						title : 'Tab 3',
//						html : '<table width="100%"" cellspacing="5px" border=0>'
//								+ '<tr><td><span style="font-weight:bold;">'
//								+ "<div id='subheader'>" + me.txtFeatures + '</div>'
//								+ '</span></td></tr>'
//								+ '<tr><td>'
//								+ me.txtColumn3
//								+ '</td></tr>' 
//								+ '</table>'
//					}]
//				});
//		var nav = Ext.create('Ext.Container', {
//					// cls : 'nav',
//					width : '100%',
//					layout : {
//						type : 'hbox',
//						align : 'end',
//						pack : 'start'
//					},
//					style : 'padding-left: 30px;',
//					items : [{
//								xtype : "button",
//								ui : "plain",
//								// width : 20,
//								text : "<<",
//								handler : function() {
//									carousel.previous();
//								}
//							}, {
//								xtype : "button",
//								// width : 20,
//								ui : "plain",
//								text : ">>",
//								handler : function() {
//									carousel.next();
//								}
//							}, {
//								xtype : 'spacer',
//								flex : 1
//							}]
//				});
//		var content = Ext.create('Ext.Panel', {
//					itemId : 'pnlContent',
//					//border : 2,
//					
//					layout : {
//						type : 'vbox',
//						pack : 'start',
//						align : 'center'
//					
//					},
//					//flex : 1,
//					//height : 210,
//					width : '100%',
//					style : 'border-top: 1px solid rgba(0, 0, 0, 0.23) !important;',
////					defaults : {
////						height : 200,
////						width : '100%'
////					},
//					//styleHtmlContent : true,
//					items : [{
//						cls: 'welcome-page',
//						html : "<div style='padding-left: 10px; padding-top: 20px;text-align: center;'>"
//								//+ "<img width='100px' height='50px' src='"+ system.getDefaultServer() +"images/logo-small-edc.png' />"
//								+ "<img width='80px' height='80px' src='data:image/png;base64,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' />"
//								+ "<div id='title'>"
//								+ me.txtWelcome
//								+ "</div>"
//								+ "</div>"
//								+ "<div id='subtitle'>" + me.txtIntro + "</div><br><br>"
//					}, {
//						xtype : 'panel',
//						cls : 'carousel',
//						//width : '100%',
//						//height : 300,
//						//layout : 'vbox',
//						//style : 'border-top: 1px solid rgba(0, 0, 0, 0.23) !important;',
//						items : [carousel]
//						
////					},{
////						html : '.&nbsp;<br>.&nbsp;<br>.&nbsp;<br>.&nbsp;<br>.&nbsp;<br>.&nbsp;<br>.&nbsp;<br>.&nbsp;<br>.&nbsp;<br>.&nbsp;<br>.&nbsp;<br>.&nbsp;<br>.&nbsp;<br>.&nbsp;<br>.&nbsp;<br>.&nbsp;<br>.&nbsp;<br>.&nbsp;<br>.&nbsp;<br>.&nbsp;<br>.&nbsp;<br>.&nbsp;<br>'
////						//flex : 1
//					}]
//				});
//		me.setItems([content]);
	},
	
	setTitle : function(title) {
		var me = this;
		var dispText = me.down("#lblTitle");
		dispText.setHtml(title);
	},
	setPanelResult : function(panel) {
		var me = this;
		var content1 = me.down("#pnlMain");
		var content2 = me.down("#pnlResult");

		if (panel == 1) {
			content1.setHidden(false);
			content2.setHidden(true);
		} else {
			content1.setHidden(true);
			content2.setHidden(false);
		}
	},
	setTopPadding : function(tp) {
		this.topPadding = p;
	},
	setBackColor : function(color) {
		this.setColor = color;
	},
	setMsgTitle : function(msg) {
		var me = this;
		var dispText = me.down("#msgLabel");
		dispText.setHtml(msg);
	},
	setMsgNote : function(msg) {
		var me = this;
		var dispText = me.down("#lblMessage");
		dispText.setHtml(msg);
	}
});