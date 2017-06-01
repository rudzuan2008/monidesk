Ext.define("mhelpdesk.model.LoadedImage", {
	extend : "Ext.data.Model",
	config : {
		identifier : {
			type : 'uuid',
			isUnique : true
		},
		fields:['timestamp','src'],
		proxy : {
			type : 'localstorage',
			id : 'loadedImageModel'
		}
	}
});

