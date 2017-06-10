system = mhelpdesk.view.System;
Ext.define('mhelpdesk.view.Ticket', {
	extend : 'Ext.form.Panel', // 'Ext.navigation.View',
	xtype : 'ticket',
	requires : ['Ext.TitleBar'],
	config : {
		method : 'post',
		url : system.getDefaultServer() + 'mopen.php',
		itemId : 'ticket',
		cls: 'p-form-ticket',
		title : '',
		scrollable : true,
		pinHeaders : true
	},
	txtTitle : "Complaint/Feedback Form",
	txtDesc : "Please fill-in the fields below as detailed as possible for your submission, <br>so we can help you as best as possible.",
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
	txtFilename : 'Attachment File',
	txtProduct : 'Unit No',
	txtProductDesc : 'Select Unit No',
	initialize : function() {
		var me = this;
		var system = mhelpdesk.view.System;
		try {
			var localStore = Ext.getStore('localClientStore');
			var isLogin = false;
			var clientId = null;
			var localConfigStore = Ext.getStore('localConfigStore');
			
			if (system.getIsLogin()){
				isLogin=true;
				clientId = system.getLastId();
			}
			var toolbarOper = Ext.create("Ext.Container", {				
				layout: {
					type: 'hbox',
					pack: 'center',
					align: 'center',
					
				},
				width : '100%',
				items : [{
					xtype : 'button',
					itemId : 'btnSubmit',
					name : 'btnSubmit',
					ui : 'plain',
					cls : 'r-square-button',
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
					cls : 'r-file-upload',
					itemId : 'fileBtnTicket',
					name : 'fileBtnTicket',
					ui : 'plain',
					cls : 'r-square-button',
					iconAlign : 'top',
					iconCls : 'fa-paperclip',
					autoUpload : false,
					captionBrowse : '<i class="fa fa-paperclip"></i><br>'+ me.txtAttachment+'<br>',
					captionReady : '<i class="fa fa-file-o"></i><br>'+ me.txtUpload+'<br>',
					url : system.getDefaultServer() + 'remote/getfile.php', // me._urlPostPicture,
					refid : 0,
					ticketid : 0,
					opertype : 'M',
					hidden: true
				}]
			});
			var panelCaptcha = Ext.create('Ext.Container',{
				name : 'panelCaptcha',
				itemId : 'panelCaptcha',
				layout : {
					type : 'hbox',
					pack : 'start',
					align : 'center'
					
				},
				items : [{
					xtype : 'label',
					cls: 'r-captcha',
					itemId : 'imgCaptcha',
					style : 'background: transparent;'
				},{
					xtype : 'button',
					text : 'Change',
					cls: 'r-button-inside',
					listeners : {
						tap : function(thisButton, e, eOpts) {
							me.fireEvent('captcha', me);
							me.down('#imgCaptcha').setStyle('background: url(../images/captcha/'+img+');width: 100px;text-align: center;font-size:bold;');
						}
					}						
				},{
					xtype : 'spacer',
					width: 5
				},{
					xtype : 'textfield',
					flex: 1,
					required : true,
					itemId : 'captcha',
					name : 'captcha',
					placeHolder : me.txtCaptchaDesc
				},{
					xtype : 'spacer',
					width: 5
				},{
					xtype : 'hiddenfield',
					itemId : 'captchaValue',
					name : 'captchaValue'
				}]
			});
			var pnlCaptcha = Ext.create("Ext.Panel", {
				itemId : 'pnlCaptcha',
				layout: {
					type: 'vbox',
					pack: 'center',
					align: 'center'
				},
				items: [{
						xtype: 'label',
						cls: 'r-label-title',
						itemId : 'labelCaptcha',
						name : 'labelCaptcha',
						html : me.txtCaptcha
					},panelCaptcha]
				
			});
			var pnlAttachment = Ext.create("Ext.Panel", {
				itemId : 'pnlAttachment',
				layout: {
					type: 'vbox',
					pack: 'center',
					align: 'center'
				},
				items: [{
						xtype: 'label',
						itemId: 'labelFilenameTicket',
						cls: 'r-label-title',
						html: me.txtFilename
					},{
						xtype: 'label',
						itemId: 'filenameTicket',
						style: 'font-size:.7em;background: transparent;padding-top:5px;padding-left:10px;',
					    styleHtmlCls: 'fieldset-item-title',
					    html: "No file selected ...",
		                styleHtmlContent: true,
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
						labelAlign : 'left',
						labelWrap : true,
						minWidth : 100,
						anchor : '90%'
					},
					items : [{
						xtype : 'textfield',
						itemId : 'company_id',
						name : 'company_id',
						value: system.getCompanyId(),
						hidden : true
					},{
						xtype : 'textfield',
						itemId : 'client_id',
						name : 'client_id',
						value: clientId,
						hidden : true
					},{
						xtype : 'textfield',
						label : me.txtName,
						required : true,
						readOnly: true,
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
						hidden : isLogin,
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
						hidden : isLogin,
						placeHolder : me.txtTelDesc,
						listeners : {
							focus : function(thisField, e, eOpts) {
								var label = this.getLabel();
								me.setInstruction(this,label,"Enter");
							}
						}
					},{
						xtype : 'selectfield',
						label : me.txtProduct,
						autoSelect : true,
						store : 'localProductStore',
						placeHolder : me.txtProductDesc,
						valueField : 'asset_id',
						displayField : 'serial_no',
						itemId : 'asset_id',
						name : 'asset_id',
						required : false,
						usePicker: true,
						listeners : {
							focus : function(thisField, e, eOpts) {
								var label = this.getLabel();
								me.setInstruction(this,label,"Choose");
							},
							change : function( thisSelect, newValue, oldValue, eOpts ) {
							}
						}
					},{
						xtype : 'selectfield',
						label : me.txtBusiness,
						autoSelect : false,
						store : 'localTopicStore',
						placeHolder : me.txtBusinessDesc,
						valueField : 'topic_id',
						displayField : 'topic',
						itemId : 'topic_id',
						name : 'topic_id',
						required : false,
						usePicker: true,
						listeners : {
							focus : function(thisField, e, eOpts) {
								var label = this.getLabel();
								me.setInstruction(this,label,"Choose");
							},
							change : function( thisSelect, newValue, oldValue, eOpts ) {
								var category = me.down('#topicId');
								category.setValue(newValue);
							}
						}
					},{
						xtype : 'hiddenfield',
						itemId : 'topicId',
						name : 'topicId'
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
						maxRows: 3,
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
						usePicker: true,
						listeners : {
							focus : function(thisField, e, eOpts) {
								var label = this.getLabel();
								me.setInstruction(this,label,"Choose");
							}
						}
					}]
				}]
			});
			me.setItems([{
				xtype : 'toolbar',
				docked : 'bottom',
				ui : 'white',
				layout : {
					type : 'hbox',
					pack : 'center',
					align : 'center'
					
				},
				items : [toolbarOper]
			},{
		        xtype: 'label',
		        itemId: 'errorMessage',
		        cls : 'error'
	        },pnlContent,pnlAttachment,pnlCaptcha]);
	        
	        
	        me.on('painted', function(){
	        	me.fireEvent('captcha', me);
	        });

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