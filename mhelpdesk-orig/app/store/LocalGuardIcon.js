Ext.define('mhelpdesk.store.LocalGuardIcon', {
    extend: "Ext.data.JsonStore",
    config: {
        storeId: 'localGuardIconStore',
        model: "mhelpdesk.model.GuardIcon",
        proxy: {
            type	:'ajax',
            url		:'remote/guard.json',
            reader	:{
                type			:'json',
                rootProperty	:'operation'//,
                //successProperty	:'success'
        	}
        }
    }
});