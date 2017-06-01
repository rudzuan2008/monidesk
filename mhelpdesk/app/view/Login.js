Ext.define('mhelpdesk.view.Login', {
	extend : 'Ext.form.Panel', // 'Ext.navigation.View',
	xtype : 'login',
	requires : ['Ext.TitleBar'],
	config : {
		itemId : 'login',
		cls: 'r-form-login',
		title : '',
		scrollable : true,
		pinHeaders : true,
		defaults : {
			labelWidth: '40%'
		}
	},
	txtTitle : "Fill Form",
	txtUserID : 'ID Pengguna',
	txtPasswd : 'Kata Laluan',
	txtLoginFail : 'Login failed. Please enter the correct credentials.',
	txtRememberMe : 'Remember Me',
	txtLoginIn : 'Log In',
	txtSignIn : 'Sign Up',
	txtRecoverPasswd : 'Forgot your password?',
	txtClickHere : 'Click Here...',
	txtUserType : 'Type',

	initialize : function() {
		var me = this;
		var system = mhelpdesk.view.System;
		try {
			me.setItems([{
	                    xtype: 'selectfield',
	                    itemId: 'usertype',
	                    name: 'usertype',
	                    label: me.txtUserType,
	                    usePicker: true,
	                    options: [
	                        {text: 'Resident',  value: 'client'},
	                        {text: 'Staff', value: 'staff'}
	                    ]
	                },{
						xtype : 'textfield',
						name : 'username',
						cls : 'r-label-user',
						inputCls : 'r-text-field',
						label : me.txtUserID,
						//autoComplete : true,
						//autoCorrect : true,
						placeHolder : this.txtUserID
					}, {
						xtype : 'passwordfield',
						name : 'password',
						cls : 'r-label-password',
						inputCls : 'r-text-field',
						label : me.txtPasswd,
						//autoComplete : true,
						//autoCorrect : true,
						placeHolder : this.txtPasswd

					}, {
						xtype : 'label',
						html : this.txtLoginFail,
						itemId : 'errorMessage',
						hidden : true,
						hideAnimation : 'fadeOut',
						showAnimation : 'fadeIn',
						style : 'color:#990000;margin:5px 0px;text-align: middle;'
					}, {
						xtype :  'togglefield',
						cls : 'r-label-rememberme',
						label : this.txtRememberMe,
						//labelWidth : '100%',
						flex: 1,
						iconCls: 'fa-check',
						//checked : true,
						value: 1,
						itemId : 'keepUser',
						name : 'keepUser'
					}, {
						itemId : 'lnkForget',
						cls : 'r-label-forget',
						html : '<div style="font-size:9pt; margin-top; 15px; margin-left: 10px;">'
								+ this.txtRecoverPasswd
								+ '&nbsp;<a href="#"> '
								+ this.txtClickHere + '</a></div>',
						listeners : {
							element : 'element',
							delegate : 'a',
							tap : function(e) {
								e.stopEvent();
								console.log(e.parent);
								console.log('anchor tapped');
								me.fireEvent('forgetPasswd', e);
								// var userPasswd =
								//Ext.create('wbiztech.view.user.UserPasswd');
							}
						}
					},{
						xtype: 'panel',
						//centered : true,
						layout: {
							type: 'hbox',
							pack : 'middle'
						},
						items : [{
							xtype : 'button',
							itemId : 'btnLogin',
							cls : 'r-login-button',
							text : this.txtLoginIn,
							//centered : true,
							iconCls : 'fa-sign-in',
							iconAlign : 'left'//,
							//ui : 'confirm'
						},{
							xtype : 'button',
							itemId : 'btnSign',
							cls : 'r-login-button',
							text : this.txtSignIn,
							//centered : true,
							iconCls : 'fa-pencil-square-o',
							iconAlign : 'left'//,
							//ui : 'confirm'
						}]
					}]);
		} catch (ex) {
			console.error(ex);
		}
	},
	displayError: function(msg){
		var me = this;
		var errorMessage = me.down('#errorMessage');
		errorMessage.setHtml(msg);
		errorMessage.setHidden(false);
		
		var delayTask = Ext.create('Ext.util.DelayedTask', 
		function() {
			errorMessage.setHidden(true);
		}, me);
		delayTask.delay(5000);
	}
});	
	