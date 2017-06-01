Ext.define('mhelpdesk.view.FileUpload', {
	extend : 'Ext.form.Panel',
	xtype : 'fileUpload',
	config : {
		title : '',
		itemId : 'fileUpload',
		// padding : 5,
		scrollable : true,
		pinHeaders : true,
		// layout : 'fit',
		defaults : {
			width : '100%',
			style : 'font-size:.75em;'
		},
		listeners : [{
			fn: 'getPhoto1',
			event : 'tap',
			delegate : '#btnCapture1'		
		}]
	},
	getPhoto1: function(thisButton, e, eOpts) {
    	var me = this;
		try{
	        console.log("take picture");
	        var file_path = me.down('#img_path');
	        var loadedImage = me.down('#loadedImage1');
			me.fireEvent('openCamera1', thisButton, file_path, loadedImage);
		}catch(ex){
			Ext.Msg.alert(ex);
		}

    },
    txtReset : 'Asal',
    txtSet : 'Set',
    txtGetPicture : 'Ambil Gambar',
	initialize : function() {
		var me = this;
		try {
			var h = screen.height;
			var w = screen.width;
			var picW = w;
			var picH = h;
			var padT = (h/4)-100;
			if (padT < 1) {
				padT = 0;
			}
			var toolbarOper = Ext.create("Ext.Container", {				
				layout: {
					type: 'hbox',
					align: 'top',
					pack: 'middle'
				},
				//height : 90,
				width : '100%',
				items : [{
					xtype : 'button',
					itemId : 'btnReset',
					name : 'btnReset',
					ui : 'white',
					iconAlign : 'top',
					// padding: '20px',
					iconCls : 'fa-database',
					style : 'font-family: "FontAwesome";margin: .5em .5em .5em;padding-left: 5px; width: 80px; text-align: -webkit-center;',
					text : me.txtReset,
					listeners : {
						tap : function(thisButton, e, eOpts) {
							
							me.fireEvent('resetPicture', me, thisButton, e, eOpts);

						}
					}
				}, {
					xtype : 'button',
					itemId : 'btnSet',
					name : 'btnSet',
					ui : 'white',
					iconAlign : 'top',
	
					// padding: '20px',
					iconCls : 'fa-times',
					style : 'font-family: "FontAwesome";margin: .5em .5em .5em;padding-left: 5px; width: 80px; text-align: -webkit-center;',
					text : me.txtSet,
					
					listeners : {
						tap : function(thisButton, e, eOpts) {
							me.fireEvent('setPicture', me, thisButton, e, eOpts);

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
			me.setItems([{
				xtype : 'toolbar',
				docked : 'bottom',
				ui : 'white',
				layout : {
					type : 'hbox',
					align : 'stretch',
					pack : 'middle'
				},
				items : [toolbarOper]
			},{
				xtype : 'textfield',
				label : 'Path', //me.txtPicDesc,
				labelAlign : 'top', 
				labelWrap : true,
				minWidth : 100,
				// label: 'Gambar',
				//width: '60%',
				placeHolder : '', //me.txtPicDesc,
				itemId : 'img_path',
				name : 'img_path',
				required : false,
				readOnly : true,
				hidden : true
			}, {
                xtype: "button",
                itemId: 'btnCapture1',
				name : "btnCapture1",

                hidden: false,
                text: me.txtGetPicture,
                height : 55,
                cls: 'form-button',
				iconCls : "fa-camera",
				style : 'font-family: "FontAwesome";',

				iconAlign : 'top',
				ui : "white",
				align : 'left'
            },{
				itemId : 'loadedImage1',
				xtype : 'img',
				//mode : 'background',
				//fullscreen : true,
				//width : '80%',
				//height : picH,
				src : 'images/mhelpdesk.png',
				style : 'background-size:100%;width:100%;min-height:200px;margin:auto;display:block;padding:2px;'
			}])
		} catch (ex) {
			console.error(ex);
		}
	}
});