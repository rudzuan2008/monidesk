Ext.define('mhelpdesk.view.Ticket', {
	extend : 'Ext.form.Panel', // 'Ext.navigation.View',
	xtype : 'ticket',
	requires : ['Ext.TitleBar'],
	config : {
		itemId : 'ticket',
		title : '',
		scrollable : true,
		pinHeaders : true
	},
	txtTitle : "Fill Form",
	txtDesc : "Please complete the fields below as detailed as possible for your queries, <br>so we can help you as best as possible.",
	txtSubmit : "Hantar",
	txtName : "Full Name",
	txtNameDesc : "Enter Full Name",
	txtEmail : "Email",
	txtEmailDesc : "Enter valid email",
	txtTel : "Telephone",
	txtTelDesc : "Enter telephone number",
	txtBusiness : "Business Category",
	txtBusinessDesc : "Choose category",
	txtSubject : "Subject",
	txtSubjectDesc : "Enter subject",
	txtMsg : "Enquiry/Question",
	txtMsgDesc : "Enter enquiry/question",
	txtPriority : "Priority",
	txtPriorityDesc : "Choose priority",
	txtCaptcha : "Captcha",
	txtCaptchaDesc : 'Enter image text',
	txtAttachment : 'Attach File',
	txtUpload : 'Change File',
	
	initialize : function() {
		var me = this;
		var system = mhelpdesk.view.System;
		try {
			function getText(){
			    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
				var text = "";
			
			    for( var i=0; i < 5; i++ )
			        text += possible.charAt(Math.floor(Math.random() * possible.length));
			        
			    return text;    
			}
			function getImage(){
				var img = "";
				var imgIndex = Math.ceil(Math.random() * 9);
				switch (imgIndex) {
				  case 0:
				    img = "bubbles.png";
				    break;
				  case 1:
				    img = "cottoncandy.png";
				    break;
				  case 2:
				    img = "crackle.png";
				    break;
				  case 3:
				    img = "grass.png";
				    break;
				  case 4:
				    img = "lines.png";
				    break;
				  case 5:
				    img = "ripple.png";
				    break;
				  case 6:
				    img = "sand.png";
				    break;
				  case 7:
				    img = "silk.png";
				    break;
				  case 8:
				    img = "snakeskin.png";
				    break;  
	    		  default:
				    img = "whirlpool.png";
				}
				return img;
			}
			
			var text = getText();
			var img = getImage();
			var toolbarOper = Ext.create("Ext.Container", {				
				layout: {
					type: 'hbox',
					align: 'top',
					pack: 'stretch'
				},
				width : '100%',
				items : [{
					xtype : 'button',
					itemId : 'btnSubmit',
					name : 'btnSubmit',
					ui : 'white',
					iconAlign : 'top',
					iconCls : 'fa-envelope-o',
					style : 'font-family: "FontAwesome";margin: .5em .5em .5em;padding-left: 5px; width: 80px; text-align: -webkit-center;',
					text : me.txtSubmit,
					listeners : {
						tap : function(thisButton, e, eOpts) {
							
							me.fireEvent('submit', me, thisButton, e, eOpts);

						}
					}
				},{
					xtype : 'fileupload',
					itemId : 'fileBtnTicket',
					name : 'fileBtnTicket',
					ui : 'white',
					iconAlign : 'top',
					iconCls : 'fa-fa-paperclip',
					//style : 'padding-top:5px;',
					style : 'font-family: "FontAwesome";margin: .5em .5em .5em; padding-top: 1.5em; padding-left: 5px; text-align: -webkit-center; height: 62px;',
					//height : 45,
					autoUpload : false,
					captionBrowse : '<i class="fa fa-paperclip"></i><br>'+ me.txtAttachment+'<br>',
					captionReady : '<i class="fa fa-file-o"></i><br>'+ me.txtUpload+'<br>',
					url : system.getDefaultServer() + 'remote/getfile.php', // me._urlPostPicture,
					refid : 0,
					ticketid : 0,
					opertype : 'M',
					//align : 'center',
					hidden: true
				}]
			});
			var pnlContent = Ext.create("Ext.Panel", {
				itemId : 'pnlTicket',
				hidden : false,
				layout : {
					type : 'vbox',
					align : 'stretch',
					pack : 'start'
				},
				//margin: 5,
				items : [{
					xtype : 'fieldset',
					title : me.txtTitle,
					instructions : me.txtDesc,
					defaults : {
						//labelWidth : '25%',
						labelAlign : 'top',
						labelWrap : true,
						minWidth : 100,
						anchor : '90%'
					},
					items : [{
						xtype : 'textfield',
						label : me.txtName,
						required : true,
						itemId : 'name',
						name : 'name',
						placeHolder : me.txtNameDesc,
						listeners : {
							focus : function(thisField, e, eOpts) {
								var label = this.getLabel();
								me.setInstruction(this,label,"Enter");
							}
						}
					},{
						xtype : 'textfield',
						label : me.txtEmail,
						required : true,
						itemId : 'email',
						name : 'email',
						placeHolder : me.txtEmailDesc,
						listeners : {
							focus : function(thisField, e, eOpts) {
								var label = this.getLabel();
								me.setInstruction(this,label,"Enter");
							}
						}
					},{
						xtype : 'textfield',
						label : me.txtTel,
						required : true,
						itemId : 'phone',
						name : 'phone',
						placeHolder : me.txtTelDesc,
						listeners : {
							focus : function(thisField, e, eOpts) {
								var label = this.getLabel();
								me.setInstruction(this,label,"Enter");
							}
						}
					},{
						xtype : 'selectfield',
						label : me.txtBusiness,
						autoSelect : true,
						store : 'localTopicStore',
						placeHolder : me.txtBusinessDesc,
						valueField : 'topic_id',
						displayField : 'topic',
						// value: 'school_id',
						itemId : 'topicId',
						name : 'topicId',
						required : false,
						listeners : {
							focus : function(thisField, e, eOpts) {
								var label = this.getLabel();
								me.setInstruction(this,label,"Choose");
							}
						}
					},{
						xtype : 'textfield',
						label : me.txtSubject,
						required : true,
						itemId : 'subject',
						name : 'subject',
						placeHolder : me.txtSubjectDesc,
						listeners : {
							focus : function(thisField, e, eOpts) {
								var label = this.getLabel();
								me.setInstruction(this,label,"Enter");
							}
						}
					},{
						xtype : 'textareafield',
						label : me.txtMsg,
						required : true,
						itemId : 'message',
						name : 'message',
						placeHolder : me.txtMsgDesc,
						listeners : {
							focus : function(thisField, e, eOpts) {
								var label = this.getLabel();
								me.setInstruction(this,label,"Enter");
							}
						}
					},{
						xtype : 'selectfield',
						label : me.txtPriority,
						autoSelect : true,
						store : 'localPriorityStore',
						placeHolder : me.txtPriorityDesc,
						valueField : 'priority_id',
						displayField : 'priority',
						itemId : 'pri',
						name : 'pri',
						required : false,
						hidden : true,
						listeners : {
							focus : function(thisField, e, eOpts) {
								var label = this.getLabel();
								me.setInstruction(this,label,"Choose");
							}
						}
					},{
						xtype: 'label',
						itemId : 'labelCaptcha',
						name : 'labelCaptcha',
						html : me.txtCaptcha,
						style : 'font-size: .8em;margin: 10px 10px 5px;font-weight:bold;' +
								'font-size: 0.8em;'
					},{
						xtype: 'panel',
						itemId : 'panelCaptcha',
						name : 'panelCaptcha',
						layout : {
							type : 'hbox',
							pack : 'left',
							align : 'center'
							
						},
						items : [{
							xtype : 'button',
							text : 'Change',
							listeners : {
								tap : function(thisButton, e, eOpts) {
									text = getText();
									img = getImage();
									me.down('#captchaValue').setValue(text);
									me.down('#imgCaptcha').setHtml(text);
									me.down('#imgCaptcha').setStyle('background: url(../images/captcha/'+img+');width: 100px;text-align: center;font-size:bold;');
								}
							}						
						},{
							xtype : 'spacer',
							width: 5
						},{
							xtype : 'label',
							itemId : 'imgCaptcha',
							style : 'background: url(../images/captcha/'+img+');width: 100px;text-align: center;font-size:bold;',
							html: text
						},{
							xtype : 'spacer',
							width: 5
						},{
							xtype : 'textfield',
							required : true,
							itemId : 'captcha',
							name : 'captcha',
							placeHolder : me.txtCaptchaDesc,
							listeners : {
								focus : function(thisField, e, eOpts) {
									me.setInstruction(this.parent,me.txtCaptcha,"Enter");
								}
							}
						},{
							xtype : 'hiddenfield',
							itemId : 'captchaValue',
							name : 'captchaValue',
							value : text
						
						}]
					}]
				},{
					xtype: 'label',
					itemId: 'filenameTicket',
					style: 'font-size:.7em;background: transparent;padding-top:5px;padding-left:10px;',
				    //cls : 'title',
				    styleHtmlCls: 'fieldset-item-title',
				    html: "No file selected ...",
	                styleHtmlContent: true,
	                hidden: true
				}]
			});
			me.setItems([{
				xtype : 'toolbar',
				docked : 'top',
				ui : 'white',
				layout : {
					type : 'hbox',
					align : 'stretch',
					pack : 'left'
				},
				items : [toolbarOper]
			},{
		        xtype: 'label',
		        itemId: 'errorMessage',
		        cls : 'error'
	        },pnlContent]);
		} catch (ex) {
			console.error(ex);
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