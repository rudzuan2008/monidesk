Ext.define('mhelpdesk.store.LocalSystemSetting', {
    extend: "Ext.data.Store",
    config: {
        storeId: 'localSystemSettingStore',
        model: "mhelpdesk.model.SystemSetting",
        autoLoad:true
    }
});