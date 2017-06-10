Ext.define('mhelpdesk.store.LocalLoadedImage', {
    extend: "Ext.data.Store",
    config: {
        storeId: 'localLoadedImageStore',
        model: "mhelpdesk.model.LoadedImage",
        autoLoad:true
    }
});