Ext.define('mhelpdesk.store.LocalResidentIcon', {
    extend: "Ext.data.JsonStore",
    config: {
        storeId: 'localResidentIconStore',
        model: "mhelpdesk.model.ResidentIcon",
        proxy: {
            type	:'ajax',
            url		:'remote/resident.json',
            reader	:{
                type			:'json',
                rootProperty	:'operation'//,
                //successProperty	:'success'
        	}
        }
    }
});