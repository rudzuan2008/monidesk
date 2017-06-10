Ext.define("mhelpdesk.component.MenuNotification", {
			extend : "Ext.Menu",
			alias : 'widget.menunotification',
			txtRegNotification : 'Daftar Makluman',
			txtMain : 'Utama',
			txtReturn : 'Kembali',
			txtGroupSubscription : 'Langganan Kumpulan',
			config : {
				defaults : {
					xtype : "menubutton",
					styleHtmlContent : 'text-align: left'
				},
				cls : 'r-menu-notification',
				width : '50%',
				minWidth : 250,
				scrollable : true,
				listeners : [{
					fn : 'onSwipe',
					event : 'swipe',
					element : 'element'
				}]
			},
			onSwipe : function(e) {
				var me = this;
				console.info(e.direction);
				if (e.direction == "left") {
					me.fireEvent('showMe', me);
				}

			},
			initialize : function() {

				this.setItems([{
							itemId : 'mnuCreateNotification',
							iconCls : 'fa-flag-o',
							menu : "mnuCreateNotification",
							text : this.txtRegNotification,
							ui : 'action',
							hidden : true
						}, {
							itemId : 'mnuGroupSubscription',
							iconCls : 'fa-sign-in',
							menu : "mnuGroupSubscription",
							text : this.txtGroupSubscription,
							ui : 'action',
							hidden : false
						}, {
							itemId : 'mnuHome',
							iconCls : 'fa-home',
							menu : "mnuHome",
							ui : 'action',
							text : this.txtMain
						}, {
							itemId : 'menuReturn',
							name : 'menuReturn',
							iconCls : 'fa-undo',
							menu : "menuReturn",
							ui : 'confirm',
							text : this.txtReturn
						}]);
				this.callParent(arguments);
			}
		});