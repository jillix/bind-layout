/*
config = {
    
    title: "Test Title",
    modules: {
        
        'idOfDomElement1': "miid",
        'idOfDomElement2': "miid"
    },
    source: {
    
        name: "operationName",
        path: "",
        data: {}
    },
    bind: [BIND_OBJECT]
}
*/
"use strict";

define(["github/adioo/bind/v0.1.1/bind"], function(bind) {
    
    return function(config) {
        
        var target = this && this.dom ? this.dom : document;
        
        //load modules
        if (config.modules) {
            
            for (var selector in config.modules) {
                
                M(target.querySelector("#" + selector), config.modules[selector]);
            }
        }
        
        //set document title
        if (config.title) {
            
            document.title = config.title;
        }
        
        //bind data
        if (config.data) {
            
            bind.call(this, config.data, null, target);
        }
        
        if (config.source) {
            
            this.link(config.source, function(err, result) {
                
                if (!err && result) {
                    
                    bind(result, null, target);
                }
            });
        }
    };
});
