Ext.define('mhelpdesk.view.Status', {
	extend : 'Ext.form.Panel', // 'Ext.navigation.View',
	xtype : 'status',
	requires : ['Ext.TitleBar'],
	config : {
		itemId : 'status',
		cls: 'p-form-status',
		title : '',
		scrollable : true,
		pinHeaders : true
	},
	txtTitle : 'Particulars',
	txtDesc : "To view the status of a ticket, provide us with your login data below.<br>If this is your first time contacting us or you've lost the ticket ID,<br>please click button <b>Create</b> to open a new ticket.",
	txtView : "Check",
	txtCreate : "Create",
	txtEmail : "Email",
	txtEmailDesc : "Enter valid email",
	txtTicket : "Ticket",
	txtTicketDesc : "Enter valid ticket",
	initialize : function() {
		var me = this;
		try {
			var toolbarOper = Ext.create("Ext.Container", {				
				layout: {
					type: 'hbox',
					pack: 'center',
					align: 'center'
					
				},
				width : '100%',
				items : [{
					xtype : 'button',
					itemId : 'btnSubmit',
					name : 'btnSubmit',
					ui : 'plain',
					cls : 'r-square-button',
					iconAlign : 'top',
					iconCls : 'fa-search',
					style : 'font-family: "FontAwesome";margin: .5em .5em .5em;padding-left: 5px; width: 80px; text-align: -webkit-center;',
					text : me.txtView,
					listeners : {
						tap : function(thisButton, e, eOpts) {
							
							me.fireEvent('viewTicket', me, thisButton, e, eOpts);

						}
					}
				},{
					xtype : 'button',
					itemId : 'btnCreate',
					name : 'btnCreate',
					ui : 'plain',
					cls : 'r-square-button',
					iconAlign : 'top',
					iconCls : 'fa-envelope-o',
					style : 'font-family: "FontAwesome";margin: .5em .5em .5em;padding-left: 5px; width: 80px; text-align: -webkit-center;',
					text : me.txtCreate,
					listeners : {
						tap : function(thisButton, e, eOpts) {
							
							me.fireEvent('createTicket', me, thisButton, e, eOpts);

						}
					}
				}]
			});
			var pnlContent = Ext.create("Ext.Panel", {
				itemId : 'userAccess',
				hidden : false,
				layout : {
					type : 'vbox',
					align : 'stretch',
					pack : 'top'
				},
				items : [{
					xtype : 'fieldset',
					title : me.txtTitle,
					instructions : me.txtDesc,
					defaults : {
						labelAlign : 'left',
						labelWidth: '40%',
						labelWrap : true,
						minWidth : 100,
						anchor : '100%'
					},
					items : [{
						xtype : 'textfield',
						label : me.txtEmail,
						required : true,
						itemId : 'lemail',
						name : 'lemail',
						placeHolder : me.txtEmailDesc,
						listeners : {
							focus : function(thisField, e, eOpts) {
								var label = this.getLabel();
								me.setInstruction(this,label,"Enter");
							}
						}
					},{
						xtype : 'textfield',
						label : me.txtTicket,
						required : true,
						itemId : 'lticket',
						name : 'lticket',
						placeHolder : me.txtTicketDesc,
						listeners : {
							focus : function(thisField, e, eOpts) {
								var label = this.getLabel();
								me.setInstruction(this,label,"Enter");
							}
						}
					}]
				}]
			});
			me.setItems([{
		        xtype: 'label',
		        itemId: 'errorMessage',
		        cls : 'error'
	        },pnlContent, {
				xtype : 'toolbar',
				docked : 'bottom',
				ui : 'white',
				layout : {
					type : 'hbox',
					pack : 'center',
					align : 'center'
					
				},
				items : [toolbarOper]
			}]);
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