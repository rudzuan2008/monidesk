// system = mhelpdesk.view.System;
Ext.define('mhelpdesk.view.TimetableNew', {
	extend : 'Ext.form.Panel',
	xtype : 'timetableNew',
	config : {
		title : '',
		MODE : 'NEW',
		itemId : 'timetableNew',
		// padding : 5,
		scrollable : true,
		pinHeaders : true,
		// layout : 'fit',
		defaults : {
			width : '100%',
			style : 'font-size:.75em;'
		},
		listeners : []
	},
	txtDescription : 'Keterangan',
	txtDescriptionDesc : 'Masuk keterangan berkenaan matapelajaran',
	txtDuration : 'Jumlah Jam',
	txtDurationDesc : 'Masukan jumlah jam',
	txtDate : "Tarikh",
	txtDateDesc : 'Pilih tarikh',
	txtTimeStart : "Masa Mula",
	txtTimeEnd : "Masa Tamat",
	txtTimeStartDesc : "0:00",
	txtTimeEndDesc : "0:00",
	txtFieldsetSubject : 'Maklumat Matapelajaran',
	txtFieldsetTimetable : 'Maklumat Masa',
	txtSubject : 'Matapelajaran',
	txtSubjectDesc : 'Masukan matapelajaran',
	txtSubjectCode : 'Kod',
	txtSubjectCodeDesc : 'Masukkan kod',
	txtScan : 'Imbas',
	txtSave : "Simpan",
	txtDelete : "Hapus",
	txtCancel : "Batal",
	initialize : function() {
		var me = this;
		try {
			var subjectCode = Ext.create("Ext.Container", {
				itemId : 'pnlSubject',
				hidden : false,
				layout : {
					type : 'hbox',
					align : 'middle',
					pack : 'left'
				},
				items : [{
					xtype : 'textfield',
					style : 'font-family: "FontAwesome";margin-top: 0em;padding: 5px;',
					labelAlign : 'top',
					label : me.txtSubjectCode,
					labelWrap : true,
					required : true,
					flex : 1,
					itemId : 'code',
					name : 'code',
					placeHolder : me.txtSubjectCodeDesc
				}, {
					xtype : 'button',
					itemId : 'btnScancode',
					name : 'btnScancode',
					ui : 'white',
					cls : 'form-button',
					iconCls : 'fa-qrcode',
					iconAlign : 'top',
					style : 'font-family: "FontAwesome";margin: .5em;padding: 5px;width:60px;height:60px; text-align: -webkit-center;',
					text : me.txtScan,
					hidden : false,
					listeners : {
						tap : function(thisButton, e, eOpts) {
							var displayField = me.down('#code');
							me.fireEvent('scanSubject', me, thisButton, displayField, e, eOpts);

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
							title : me.txtFieldsetSubject,
							defaults : {
								labelWidth : '25%',
								labelWrap : true,
								minWidth : 100,
								anchor : '100%'
							},
							items : [subjectCode, {
										xtype : 'textfield',
										label : me.txtSubject,
										labelWrap : true,
										required : true,
										itemId : 'subject',
										name : 'subject',
										placeHolder : me.txtSubjectDesc
									}, {
										xtype : 'textareafield',
										//label : me.txtDescription,
										maxRows : 4,
										placeHolder : me.txtDescriptionDesc,
										name : 'description',
										itemId : 'description'
									}]
						}, {
							xtype : 'fieldset',
							title : me.txtFieldsetTimetable,
							defaults : {
								labelWidth : '30%',
								labelWrap : true,
								minWidth : 100,
								anchor : '100%'
							},
							items : [{
									xtype : 'datepickerfield',
									label : me.txtDate,
									dateFormat : 'd-m-Y',
									itemId : 'fdate',
									name : 'fdate',
									required : true,
									placeHolder : me.txtDateDesc//,
									//value : new Date()
								},{
									xtype : 'textfield',
									label : me.txtTimeStart,
									labelWrap : true,
									required : true,
									itemId : 'stime',
									name : 'stime',
									placeHolder : me.txtTimeStartDesc
								}, {
									xtype : 'textfield',
									label : me.txtTimeEnd,
									labelWrap : true,
									required : true,
									itemId : 'etime',
									name : 'etime',
									placeHolder : me.txtTimeEndDesc
								},{
									xtype : 'numberfield',
									label : me.txtDuration,
									labelWrap : true,
									required : true,
									itemId : 'duration',
									name : 'duration',
									minValue : 0,
									maxValue : 12,
									placeHolder : me.txtDurationDesc
								}]
						}]
					})
			
			var toolbarOper = Ext.create("Ext.Container", {
				
				layout: {
					type: 'hbox',
					align: 'top',
					pack: 'stretch'
				},
				//height : 90,
				width : '100%',
				items : [{
					xtype : 'button',
					itemId : 'btnSubmit',
					name : 'btnSubmit',
					ui : 'white',
					iconAlign : 'top',
					// padding: '20px',
					iconCls : 'fa-database',
					style : 'font-family: "FontAwesome";margin: .5em .5em .5em;padding-left: 5px; width: 80px; text-align: -webkit-center;',
					text : me.txtSave,
					listeners : {
						tap : function(thisButton, e, eOpts) {
							
							me.fireEvent('save', me, thisButton, e, eOpts);

						}
					}
				}, {
					xtype : 'button',
					itemId : 'btnDelete',
					name : 'btnDelete',
					ui : 'white',
					iconAlign : 'top',
					// padding: '20px',
					iconCls : 'fa-trash-o',
					style : 'font-family: "FontAwesome";margin: .5em .5em .5em;padding-left: 5px; width: 80px; text-align: -webkit-center;',
					text : me.txtDelete,
					listeners : {
						tap : function(thisButton, e, eOpts) {
//							me.fireEvent('remove_subject', me, thisButton, e, eOpts);
							
							var locale = mhelpdesk.view.Locale;
							Ext.Msg.confirm(locale.getAlertText(), locale.getText("msgAsk"), function(buttonID, value, opts) {
								console.error(buttonID);
								if (buttonID=="yes") {
	
									me.fireEvent('remove_subject', me, thisButton, e, eOpts);

								}
							}, this);
							
						}
					}
				},{
					xtype : 'button',
					itemId : 'btnCancel',
					name : 'btnCancel',
					ui : 'white',
					iconAlign : 'top',
	
					// padding: '20px',
					iconCls : 'fa-times',
					style : 'font-family: "FontAwesome";margin: .5em .5em .5em;padding-left: 5px; width: 80px; text-align: -webkit-center;',
					text : me.txtCancel,
					
					listeners : {
						tap : function(thisButton, e, eOpts) {
							me.fireEvent('cancel', me, thisButton, e, eOpts);

						}
					}
				}, {
					// iconCls : "fa-info-circle",
					// cls : 'my-toolbar',
					style : 'font-family: "FontAwesome"; text-align: center;',
					xtype : "button",
					text : '<i class="fa fa-info-circle"></i>',
					name : "btnHelp",
					itemId : 'btnHelp',
					// iconCls : "list",
					ui : "plain",
					align : 'middle',
					docked : 'right',
					
					listeners : {
						tap : function(thisButton, e, eOpts) {
							me.fireEvent('info', me, thisButton, e, eOpts);

						}
					}
				}]
			});
			me.setItems([pnlContent, {
                xtype: 'hiddenfield',
                itemId : 'timetable_id',
                name: 'timetable_id'
            },{
				xtype : 'toolbar',
				docked : 'top',
				ui : 'white',
				layout : {
					type : 'hbox',
					align : 'stretch',
					pack : 'left'
				},
				items : [toolbarOper]
			}]);
			// me.setItems({html : "this is a test"});
		} catch (ex) {
			console.error(ex);
		}
	}
});