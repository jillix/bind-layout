'use strict';

var Bind = require('github/jillix/bind');
var Events = require('github/jillix/events');

// a recursive function until a module
function tryNextModule (miids, index, container, dataContext) {
    // stop when no more modules
    if (!miids[index]) {
        return;
    }
    // otherwise go and try to load the module
    M(container, miids[index], dataContext, function(err, module) {
        if (err) {
            tryNextModule(miids, ++index, container, dataContext);
        }
    });
}

module.exports = function (config) {

    var self = this;
    var target = self && self.dom ? self.dom : document;
    
    Events.call(self, config);

    function loadModules (dataCtx) {
        // load modules
        for (var selector in config.modules) {

            var modules = config.modules[selector];
            var container = target.querySelector('#' + selector);

            if (typeof modules === 'string') {
                M(container, modules);
            }
            // assuming an array
            else if (modules.length) {
                // start finding the first accessible miid in the module array
                tryNextModule(modules, 0, container, dataCtx);
            }
        }
    }

    loadModules(dataContext);

    self.reload = function (dataCtx) {
        loadModules(dataCtx);
    };

    // set document title
    if (config.title) {
        document.title = config.title;
    }

    // run the binds
    for (var i in config.binds) {
        Bind.call(self, config.binds[i]);
    }

    if (typeof window[config.onInitEnd] === 'function') {
        window[config.onInitEnd].apply(self);
    }
};

