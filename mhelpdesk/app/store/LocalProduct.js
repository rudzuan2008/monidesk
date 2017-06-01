Ext.define('mhelpdesk.store.LocalProduct', {
    extend: "Ext.data.Store",
    config: {
        storeId: 'localProductStore',
        model: "mhelpdesk.model.Product",
        grouper: {
            groupFn: function(record) {
            },
            sortProperty: 'asset_id'
        }
    }
});