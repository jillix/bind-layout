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
        
        if (config.html && target) {
            
            // create module container
            var container = document.createElement("div");
            
            // add miid to html
            container.setAttribute("id", this.miid);
            
            // add html
            container.innerHTML = config.html;
            
            // append module to the dom
            target.appendChild(container);
        }
        
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
