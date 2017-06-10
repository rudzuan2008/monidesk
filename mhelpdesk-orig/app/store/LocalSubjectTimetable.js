Ext.define('mhelpdesk.store.LocalSubjectTimetable', {
    extend: "Ext.data.Store",
    txtTest: 'abc',
    config: {
        storeId: 'localSubjectTimetableStore',
        model: "mhelpdesk.model.SubjectTimetable",
        autoLoad:true,
        grouper: {
            groupFn: function(record) {
            },
            direction:'ASC',
            sortProperty: 'sdatetime'
        }
    }
});