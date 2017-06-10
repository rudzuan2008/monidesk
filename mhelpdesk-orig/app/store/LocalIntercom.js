Ext.define('mhelpdesk.store.LocalIntercom', {
    extend: "Ext.data.JsonStore",
    config: {
        storeId: 'localIntercomStore',
        model: "mhelpdesk.model.Intercom",
        data: [
        	{id:1,number:'6015001',ip:'',name:'Salman Alai'},
            {id:2,number:'6015002',ip:'',name:'Abus Warni'},
            {id:3,number:'6015003',ip:'',name:'Ahmad Salimin'},
            {id:4,number:'6015004',ip:'',name:'Kassim Abdul'},
            {id:5,number:'6015005',ip:'',name:'Malibun'}
        ]
    }
});