Ext.define("mhelpdesk.component.MenuActivity", {
			extend : "Ext.Menu",
			alias : 'widget.menuactivity',
			txtRegEvent:'Daftar Aktiviti',
			txtMain : 'Utama',
			txtReturn : 'Kembali',
			config : {
				defaults : {
					xtype : "menubutton",
					styleHtmlContent : 'text-align: left'
				},
				cls : 'r-menu-activity',
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
							itemId : 'mnuCreateEvent',
							iconCls : 'fa-calendar',
							menu : "mnuCreateEvent",
							text : this.txtRegEvent,
							ui : 'action',
							hidden : true
						}, {
							itemId : 'mnuHome',
							iconCls : 'fa-home',
							menu : "mnuHome",
							ui : 'action',
							text : this.txtMain
						}, {
							itemId : 'mnuReturn',
							iconCls : 'fa-undo',
							menu : "mnuReturn",
							ui : 'confirm',
							text : this.txtReturn
						}]);
				this.callParent(arguments);
			}
		});