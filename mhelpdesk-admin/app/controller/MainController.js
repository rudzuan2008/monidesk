Ext.define('wtadmin.controller.MainController', {
    extend: 'Ext.app.Controller',
	requires : [],
	_debugModule : 'Main',
	_debugLine : 0,
	_user : null,
	
    config: {
    	itemId : 'controller',
        refs: {
            
        },
        control: {
            
        }
    },
    
    //called when the Application is launched, remove if not needed
    launch: function(app) {
        console.log(app);
        Ext.Viewport.add(Ext.create('wtadmin.view.Main'));
    }
});
