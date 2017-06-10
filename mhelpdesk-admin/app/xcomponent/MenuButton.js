Ext.define("wtadmin.component.MenuButton", {
    extend: "Ext.Button",
    xtype:"menubutton",
    config: {
    	//width : '100%',
    	height : '50px',
    	showAnimation: 'fadeIn',
    	//style : 'background: -webkit-linear-gradient(#c6c3c6, #e7e7e7);',
        menu:null
    }
});