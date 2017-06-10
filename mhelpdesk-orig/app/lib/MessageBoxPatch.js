Ext.define('Ext.ux.MessageBoxPatch', {
    override: 'Ext.MessageBox',

    show: function(initialConfig) {
        Ext.util.InputBlocker.blockInputs();
        //if it has not been added to a container, add it to the Viewport.
        if (!this.getParent() && Ext.Viewport) {
            Ext.Viewport.add(this);
        }
        
        /***** NEW CODE *******/
        this.setHidden(false);
        /**********************/
    
        if (!initialConfig) {
            return this.callParent();
        }
    
        var config = Ext.Object.merge({}, {
            value: ''
        }, initialConfig);
    
        var buttons        = initialConfig.buttons || Ext.MessageBox.OK || [],
            buttonBarItems = [],
            userConfig     = initialConfig;
    
        Ext.each(buttons, function(buttonConfig) {
        	try{
	            if (!buttonConfig) {
	                return;
	            }
	    
	            buttonBarItems.push(Ext.apply({
	                userConfig: userConfig,
	                scope     : this,
	                handler   : 'onClick'
	            }, buttonConfig));
        	}catch(ex){
        		
        	}
        }, this);
    
        config.buttons = buttonBarItems;
    
        if (config.promptConfig) {
            //<debug warn>
            Ext.Logger.deprecate("'promptConfig' config is deprecated, please use 'prompt' config instead", this);
            //</debug>
        }
        config.prompt = (config.promptConfig || config.prompt) || null;
    
        if (config.multiLine) {
            config.prompt = config.prompt || {};
            config.prompt.multiLine = config.multiLine;
            delete config.multiLine;
        }
    
        config = Ext.merge({}, this.defaultAllowedConfig, config);
    
        this.setConfig(config);
    
        var prompt = this.getPrompt();
        if (prompt) {
            prompt.setValue(initialConfig.value || '');
        }
    
        this.callParent();
    
        return this;
    },

    hide: function(initialConfig) {
        this.setHidden(true);
        return this.callParent(arguments);
    }

}, function () {
    // <debug>
    console.info("Ext.util.MessageBoxPatch temp. fix is active");
    // </debug>
});