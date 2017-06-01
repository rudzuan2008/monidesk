Ext.define('mhelpdesk.view.SystemConfig', {
	extend : 'Ext.form.Panel',
	xtype : 'systemConfig',
	requires : ['Ext.TitleBar', 'Ext.Toolbar', 'Ext.form.FieldSet'],
	config : {
		title : '',
		itemId : 'systemConfig',
		padding : 5,
		scrollable : 'vertical',
		pinHeaders : true,
		layout : {
			type : 'vbox'
		},
		defaults : {
			labelWidth : '30%',
			labelAlign : 'left',
			labelWrap : true,
			minWidth : 100,
			anchor : '100%'
		},
		listeners : [{
					fn : 'onSoundFlagChange',
					event : 'change',
					delegate : '#sound_flag'
				}, {
					fn : 'onSwipe',
					event : 'swipe',
					element : 'element'
				}],
		items : []
	},
	onSwipe : function(e) {
		var me = this;
		console.info(e.direction);
		if (e.direction == "right") {
			me.fireEvent('back', me);
		}

	},
	txtPageTitle: 'System Setting',
	txtHeader : 'Screen Mode',
	txtEmail : 'Emel',
	txtEmailDesc : 'Masukan emel',
	txtPhone : 'Telefon',
	txtPhoneDesc : 'Masukan telefon',
	txtTitle : 'Nama Aplikasi',
	txtTitleDesc : 'Masukan Nama Aplikasi',
	txtMember : 'Ahli',
	txtMemberDesc : 'Masukan Ahli Kumpulan',
	txtLanguage : 'Bahasa',
	txtLanguageDesc : 'Pilihan Bahasa',
	txtTickerInterval : 'Kelipan Skrin',
	txtTickerIntervalDesc : 'in second',
	txtUseSound : 'Bunyi',
	txtUseSoundDesc : 'Pilihan Bunyi',
	txtNotice : 'Keterangan Aplikasi',
	txtNoticeDesc : 'Maklumat Aplikasi',
	txtColorTrue : "Warna Betul",
	txtColorFalse : 'Warna Salah',
	txtSave : "Kemaskini",
	txtCancel : "Batal",
	txtRed : 'Merah',
	txtYellow : 'Kuning',
	txtOrange : 'Oren',
	txtGreen : 'Hijau',
	txtBlue : 'Biru',
	txtTheme : 'Theme',
	txtBM : 'Bahasa Malaysia',
	txtEN : 'English',
	txtJohorTheme : 'Johor Theme',
	txtDefaultTheme : 'Default Theme',
	initData : function() {
		var me = this;
		var system = mhelpdesk.view.System;
		var locale = mhelpdesk.view.Locale;
		try {

			var localSystemSettingStore = system.getLocalSystemSettingStore(); // Ext.getStore('localSystemSettingStore');

			var record = localSystemSettingStore.findRecord('sys_id', 1);
			var sound = record.get("sound");
			var soundFlag = 0;

			if (sound == 1) {
				soundFlag = 1;
			}

			me.down("#title").setValue(record.data.title);
			me.down("#members").setValue(record.data.members);
			me.down("#locale").setValue(record.data.locale);
			me.down("#ticker_interval").setValue(record.data.ticker_interval);
			me.down("#sound").setValue(soundFlag);
			me.down("#notice").setValue(record.data.notice);
			me.down("#color_true").setValue(record.data.color_true);
			me.down("#color_false").setValue(record.data.color_false);
			me.down("#email").setValue(record.data.email);
			me.down("#phone").setValue(record.data.phone);

		} catch (ex) {
			console.error(ex);
		}
	},
	initialize : function() {
		var me = this;
		var system = mhelpdesk.view.System;
		var locale = mhelpdesk.view.Locale;
		try {

			var localSystemSettingStore = system.getLocalSystemSettingStore(); // Ext.getStore('localSystemSettingStore');

			var record = localSystemSettingStore.findRecord('sys_id', 1);
			var sound = record.get("sound");
			var soundFlag = 0;

			if (sound == 1) {
				soundFlag = 1;
			}
			var toolbarOper = Ext.create("Ext.Container", {

				layout : {
					type : 'hbox',
					pack : 'center',
					align : 'center'
					
				},
				// height : 90,
				width : '100%',
				items : [{
					xtype : 'button',
					itemId : 'btnSubmit',
					name : 'btnSubmit',
					ui : 'plain',
					cls: 'r-square-button',
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
						// }, {
						// xtype : 'button',
						// itemId : 'btnCancel',
						// name : 'btnCancel',
						// ui : 'white',
						// iconAlign : 'top',
						//			
						// // padding: '20px',
						// iconCls : 'fa-times',
						// style : 'font-family: "FontAwesome";margin: .5em .5em
						// .5em;padding-left: 5px; width: 80px; text-align:
						// -webkit-center;',
						// text : me.txtCancel,
						//							
						// listeners : {
						// tap : function(thisButton, e, eOpts) {
						// me.fireEvent('cancel', me, thisButton, e, eOpts);
						//		
						// }
						// }
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
			this.setItems([{
				xtype: 'label',
				cls: 'r-title',
				html: me.txtPageTitle
			},{
				xtype : 'hiddenfield',
				label : 'Company',
				itemId : 'company',
				name : 'company',
				value : record.data.company	
				
			},{
						xtype : 'textfield',
						label : me.txtTitle,
						placeHolder : this.txtTitleDesc,
						itemId : 'title',
						name : 'title',
						readOnly : true,
						value : record.data.title
					}, {
						xtype : 'textareafield',
						label : me.txtMember,
						placeHolder : this.txtMemberDesc,
						itemId : 'members',
						name : 'members',
						value : record.data.members,
						hidden : true,
						maxRows : 2
					}, {
						xtype : 'textareafield',
						label : me.txtNotice,
						placeHolder : this.txtNoticeDesc,
						itemId : 'notice',
						name : 'notice',
						value : record.data.notice,
						hidden : true,
						maxRows : 3
					}, {
						xtype : 'textfield',
						label : me.txtEmail,
						placeHolder : this.txtEmailDesc,
						itemId : 'email',
						name : 'email',
						hidden : true,
						value : record.data.email
					}, {
						xtype : 'textfield',
						label : me.txtPhone,
						placeHolder : this.txtPhoneDesc,
						itemId : 'phone',
						name : 'phone',
						hidden : true,
						value : record.data.phone
					}, {
						xtype : 'selectfield',
						label : this.txtLanguage,
						autoSelect : true,
						readOnly : false,
						placeHolder : this.txtLanguageDesc,
						options : [{
									text : this.txtBM,
									value : 'ms_MY'
								}, {
									text : this.txtEN,
									value : 'en'
								}],
						itemId : 'locale',
						name : 'locale',
						value : record.data.locale,
						required : false
					}, {
						xtype : 'selectfield',
						label : this.txtTheme,
						autoSelect : true,
						readOnly : false,
						options : [{
									text : this.txtDefaultTheme,
									value : 'app.css'
								}, {
									text : this.txtJohorTheme,
									value : 'cupertino.css'
								}],
						itemId : 'theme',
						name : 'theme',
						value : record.data.theme,
						required : false
					},{
						xtype : 'selectfield',
						label : this.txtColorTrue,
						autoSelect : true,
						readOnly : false,
						options : [{
									text : this.txtRed,
									value : 'red'
								}, {
									text : this.txtOrange,
									value : '#ffb600'
								}, {
									text : this.txtYellow,
									value : '#ff0'
								}, {
									text : this.txtGreen,
									value : 'green'
								}, {
									text : this.txtBlue,
									value : '#009dff'
								}],
						itemId : 'color_true',
						name : 'color_true',
						value : record.data.color_true,
						hidden : true,
						required : true
					}, {
						xtype : 'selectfield',
						label : this.txtColorFalse,
						autoSelect : true,
						readOnly : false,
						options : [{
									text : this.txtRed,
									value : 'red'
								}, {
									text : this.txtOrange,
									value : '#ffb600'
								}, {
									text : this.txtYellow,
									value : '#ff0'
								}, {
									text : this.txtGreen,
									value : 'green'
								}, {
									text : this.txtBlue,
									value : '#009dff'
								}],
						itemId : 'color_false',
						name : 'color_false',
						value : record.data.color_false,
						hidden : true,
						required : true
					}, {
						xtype : 'textfield',
						label : me.txtTickerInterval,
						placeHolder : this.txtTickerIntervalDesc,
						itemId : 'ticker_interval',
						name : 'ticker_interval',
						hidden : true,
						value : record.data.ticker_interval
					}, {
						xtype : 'togglefield',
						itemId : 'sound',
						name : 'sound',
						value : soundFlag,
						hidden : false,
						label : me.txtUseSound
//					}, {
//						xtype : 'togglefield',
//						itemId : 'screen_mode',
//						name : 'screen_mode',
//						value : record.data.screenMode,
//						label : me.txtHeader
					}, {
						xtype : 'selectfield',
						label : this.txtHeader,
						autoSelect : true,
						readOnly : false,
						options : [{
									text : "Normal Mode",
									value : 0
								}, {
									text : "Modern Mode",
									value : 1
								}, {
									text : "Guard Mode",
									value : 2
								}],
						itemId : 'screen_mode',
						name : 'screen_mode',
						value : record.data.screenMode,
						required : false
					}, {
						xtype : 'toolbar',
						docked : 'bottom',
						ui : 'white',
						layout : {
							type : 'hbox',
							pack : 'center',
							align : 'center',
							
						},
						items : [toolbarOper]
					}]);
		} catch (ex) {
			console.error(ex);
		}
		this.callParent(arguments);
	},

	onSoundFlagChange : function(slider, newValue, oldValue, eOpts) {
		var me = this;
		me.fireEvent('soundChange', this, slider, newValue, oldValue, eOpts);
	}
});