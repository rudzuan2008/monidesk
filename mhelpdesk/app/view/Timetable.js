// system = mhelpdesk.view.System;
Ext.define('mhelpdesk.view.Timetable', {
	extend : 'Ext.Container',
	// xtype : 'activity',
	alias : 'widget.timetable',
	requires : [],
	config : {
		itemId : 'activity',
		layout : {
			type : 'fit',
			animation : 'flip'
		},
		listeners : [{
					fn : 'onSwipe',
					event : 'swipe',
					element : 'element'
				}, {
					fn : 'onChange',
					event : 'change',
					delegate : '#timetableDate'
				}]
	},
	onChange : function(thisObject, newDate, oldDate, eOpts) {
		var me = this;
		try{
			console.log(thisObject.getValue());
			me.fireEvent('dateChange', thisObject, newDate, oldDate, eOpts);
		}catch(ex){
			console.error(ex);
		}
	},
	onSwipe : function(e) {
		var me = this;
		console.info(e.direction);
		if (e.direction == "right") {
		}
		if (e.direction == "left") {
		}

	},
	txtDate : 'Tarikh',
	initialize : function() {
		var me = this;
		
		try {
			var pnlContent = Ext.create("Ext.Panel", {
						layout : {
							type : 'vbox',
							pack : 'top',
							align : 'stretch'
						},
						items : [{
									xtype : 'container',
									items : [{
												xtype : 'datepickerfield',
												label : this.txtDate,
												dateFormat : 'd-m-Y',
												itemId : 'timetableDate',
												name : 'timetableDate',
												value : new Date()
											}]

								}, {
									xtype : 'timetableList',
									flex : 1
								}]
					})
			// var grid = Ext.create('Ext.grid.Panel', {
			// // store: userStore,
			// width : 400,
			// height : 200,
			// title : 'Jadual Waktu',
			// columns : [{
			// text : 'Masa',
			// width : 100,
			// sortable : false,
			// hideable : false,
			// flex : 1,
			// dataIndex : 'name'
			// }, {
			// text : 'Isnin',
			// width : 50,
			// dataIndex : 'col1',
			// hidden : true
			// }, {
			// text : 'Selasa',
			// width : 50,
			// dataIndex : 'col2'
			// }, {
			// text : 'Isnin',
			// width : 50,
			// dataIndex : 'col3',
			// hidden : true
			// }, {
			// text : 'Rabu',
			// width : 50,
			// dataIndex : 'col4'
			// }, {
			// text : 'Khamis',
			// width : 50,
			// dataIndex : 'col5',
			// hidden : true
			// }, {
			// text : 'Jumaat',
			// width : 50,
			// dataIndex : 'col6'
			// }]
			// });
			me.setItems([pnlContent]);
		} catch (ex) {
			console.error(ex);
		}
	}
});