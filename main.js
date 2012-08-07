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
    bind: [
        {
            val: "Logout",
            query: "#logout"
            events: {
                
                mouseup: {
                    
                    method: "logout",
                    args: ["/route/to/public/page"]
                }
            }
        },
        {
            val: "DE",
            query: "#i18n_de"
            events: {
                
                mouseup: {
                    
                    method: "i18n",
                    args: ["de"]
                }
            }
        },
        {
            val: "EN",
            query: "#i18n_en"
            events: {
                
                mouseup: {
                    
                    method: "i18n",
                    args: ["en"]
                }
            }
        }
    ]
}
*/
        
define(["github/adioo/bind/6370c634636f5bd669f10bb27dd03a64629c3f95/bind"], function(Bind) {
    
    var Layout = {
        
        i18n: function(locale) {
            
            N.obs("i18n").f("change", locale);
            // TODO fetch own data
        },
        
        logout: function(route) {
            
            N.logout(function() {
                
                window.location(route || "/");
            });
        }
    };
    
    function init(config) {
        
        this.conf = config;
        
        var layout = N.ext(Layout, Bind(this));
        
        //load modules
        if (layout.conf.modules) {
            
            for (var selector in layout.conf.modules) {
                
                N.mod(this.dom.querySelector("#" + selector), layout.conf.modules[selector]);
            }
        }
        
        //set document title
        if (layout.conf.title) {
            
            document.title = layout.conf.title;
        }
        
        //bind data
        if (layout.conf.source || layout.conf.data) {
            
            if (layout.conf.data) {
                
                layout.bind(layout.conf.data);
            }
            
            if (layout.conf.source) {
            
                layout.link(layout.conf.source, function(err, result) {
                    
                    if (!err && result) {
                        
                        layout.bind(result);
                    }
                });
            }
        }
    }
    
    return init;
});