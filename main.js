/*
config = {
    
    "title": "Test Title",

    "modules": {
        "domElemId1": "miid1",
        "domElemId2": ["miid2", "alternativeMiid", "errorMiid"]
    },

    "source": {
        "name": "operationName",
        "path": "",
        "data": {}
    },

    "bind": [BIND_OBJECT]
}
*/
"use strict";

define(["github/adioo/bind/v0.1.1/bind"], function(bind) {
    
    // a recursive function until a module
    function tryNextModule(miids, index, container) {
        // stop when no more modules
        if (!miids[index]) {
            return;
        }
        // otherwise go and try to load the module
        M(container, miids[index], function(err, module) {
            if (err) {
                tryNextModule(miids, ++index, container);
            }
        });
    }

    return function(config) {
        
        var target = this && this.dom ? this.dom : document;
        
        // load css
        if (config.css) {
            
            // get head reference
            var head = document.getElementsByTagName("head")[0];
            
            for (var i in config.css) {
                
                var href;
                
                if (config.css[i].indexOf("http") > -1) {
                    
                    href = config.css[i];
                }
                else {
                    
                    href = this.ok + "/core/getFile" + (config.css[i][0] == "/" ? "" : "/") + config.css[i]
                }
                
                // create link and append it to the DOM
                var link = document.createElement("link");
                var attributes = {
                        rel:    "stylesheet",
                        type:   "text/css",
                        href:   href
                    };
                    
                for (var name in attributes) {
                    
                    link.setAttribute(name, attributes[name]);
                }
                
                head.appendChild(link);
            }
        }
        
        // load modules
        for (var selector in config.modules) {

            var modules = config.modules[selector];
            var container = target.querySelector("#" + selector);

            if (typeof modules === "string") {
                M(container, modules);
            }
            // assuming an array
            else if (modules.length) {
                // start finding the first accessible miid in the module array
                tryNextModule(modules, 0, container);
            }
        }
        
        // set document title
        if (config.title) {
            document.title = config.title;
        }

        // bind data
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
