Ext.define('mhelpdesk.store.LocalVisitorIcon', {
    extend: "Ext.data.JsonStore",
    config: {
        storeId: 'localVisitorIconStore',
        model: "mhelpdesk.model.VisitorIcon",
        proxy: {
            type	:'ajax',
            url		:'remote/visitor.json',
            reader	:{
                type			:'json',
                rootProperty	:'operation'//,
                //successProperty	:'success'
        	}
        }
    }
});