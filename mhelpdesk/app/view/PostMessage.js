Ext.define('mhelpdesk.view.PostMessage', {
	extend : 'Ext.form.Panel', // 'Ext.navigation.View',
	xtype : 'postMessage',
	requires : ['Ext.TitleBar'],
	config : {
		itemId : 'postMessage',
		title : '',
		scrollable : true,
		pinHeaders : true,
		listeners : [{
			fn : 'onSwipe',
			event : 'swipe',
			element : 'element'
		}]
	},
	txtTitle : 'Message / Post Note',
	txtDesc : 'Enter your message below:',
	txtPost : 'Submit',
	txtCancel : 'Cancel',
	txtAttachment : 'Attach File',
	txtUpload : 'Change File',
	onSwipe : function(e) {
		var me = this;
		console.info(e.direction);
		if (e.direction == "right") {
			me.fireEvent('swipeBack', me);
		}
	},
	initialize : function() {
		var me = this;
		var system = mhelpdesk.view.System;
		try {
			var pnlContent = Ext.create("Ext.Panel", {
				itemId : 'pnlContent',
				hidden : false,
				layout : {
					type : 'vbox',
					align : 'stretch',
					pack : 'top'
				},
				margin: 5,
				items : [{
					xtype : 'fieldset',
					title : me.txtTitle,
					defaults : {
						labelWidth : '25%',
						labelWrap : true,
						minWidth : 100,
						//width : '100%',
						anchor : '100%',
						margin : 5
					},
					items : [{
	                    xtype: 'textareafield',
	                    //label: 'Bio',
	                    maxRows: 6,
	                    itemId: 'message',
	                    name: 'message',
	                    placeHolder :  me.txtDesc
	                }]
				},{
					itemId : 'fileBtn',
					xtype : 'fileupload',
					//style : 'padding-top:5px;',
					height : 45,
					autoUpload : false,
					captionBrowse : '<i class="fa fa-file-image-o"></i><br>'
							+ me.txtAttachment,
					captionReady : '<i class="fa fa-file-image-o"></i><br>'
							+ me.txtUpload,
					url : system.getDefaultServer() + 'remote/getfile.php', // me._urlPostPicture,
					refid : 0,
					ticketid : 0,
					opertype : 'M',
					align : 'center'
				},{
					xtype: 'label',
					itemId: 'filename',
					style: 'font-size:.7em;background: transparent;padding-top:5px;padding-left:10px;',
				    //cls : 'title',
				    styleHtmlCls: 'fieldset-item-title',
				    html: "No file selected ...",
	                styleHtmlContent: true
				}]
			});
			var toolbarOper = Ext.create("Ext.Container", {				
				layout: {
					type: 'hbox',
					align: 'top',
					pack: 'stretch'
				},
				width : '100%',
				items : [{
					xtype : 'hiddenfield',
					itemId : 'id',
					name : 'id'
				},{
					xtype : 'button',
					itemId : 'btnSubmit',
					name : 'btnSubmit',
					ui : 'white',
					iconAlign : 'top',
					iconCls : 'mail',
					style : 'font-family: "FontAwesome";margin: .5em .5em .5em;padding-left: 5px; width: 80px; text-align: -webkit-center;',
					text : me.txtPost,
					listeners : {
						tap : function(thisButton, e, eOpts) {
							
							me.fireEvent('postReply', me, thisButton, e, eOpts);
	
						}
					}
				},{
					xtype : 'button',
					itemId : 'btnCancel',
					name : 'btnCancel',
					ui : 'white',
					hidden : true,
					iconAlign : 'top',
					iconCls : 'search',
					style : 'font-family: "FontAwesome";margin: .5em .5em .5em;padding-left: 5px; width: 80px; text-align: -webkit-center;',
					text : me.txtCancel,
					listeners : {
						tap : function(thisButton, e, eOpts) {
							
							me.fireEvent('postCancel', me, thisButton, e, eOpts);
	
						}
					}
				}]
			});
			me.setItems([{
				xtype : 'toolbar',
				docked : 'top',
				ui : 'white',
				layout : {
					type : 'vbox',
					align : 'stretch',
					pack : 'top'
				},
				items : [toolbarOper]
			},{
		        xtype: 'label',
		        itemId: 'errorMessage',
		        cls : 'error'
	        },pnlContent]);
		}catch(ex){
			
		}
	},
	doDelay : function(timer, functionCall) {
		var me = this;
		var locMod = "doDelay";
		try {
			var delayTask = Ext
					.create('Ext.util.DelayedTask', functionCall, me);
			delayTask.delay(timer);
		} catch (ex) {
			console.error(ex);
		}

	},
	setInstruction : function(thisField, label, word) {
		var me =this;
		var locale = mhelpdesk.view.Locale;
		try {
			thisField.parent.setInstructions(locale.getText(word)+" "+label);
			me.doDelay(3000, function() {
				thisField.parent.setInstructions(me.txtDesc);
			});
		} catch (ex) {
			console.error(ex);
		}
	}
});