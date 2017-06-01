Ext.define('mhelpdesk.store.LocalDailyTimetable', {
    extend: "Ext.data.Store",
    txtTest: 'abc',
    config: {
        storeId: 'localDailyTimetableStore',
        model: "mhelpdesk.model.DailyTimetable",
        autoLoad:true,
        grouper: {
            groupFn: function(record) {
            },
            direction:'ASC',
            sortProperty: 'sdatetime'
        }
    }
});