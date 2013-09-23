'use strict';

var Bind = require('github/jillix/bind');
var Events = require('github/jillix/events');

// a recursive function until a module
function tryNextModule (miids, index, container, dataContext, self) {
    // stop when no more modules
    if (!miids[index]) {
        return self.emit("ready");
    }
    // otherwise go and try to load the module
    M(container, miids[index], dataContext, function(err, module) {
        if (err) {
            tryNextModule(miids, ++index, container, dataContext);
        }
    });
}

module.exports = function (config, dataContext) {

    var self = this;
    var target = self && self.dom ? self.dom : document;

    Events.call(self, config);

    function loadModules (dataCtx) {
        // load modules
        for (var selector in config.modules) {
            if (!config.modules.hasOwnProperty(selector)) return;
            
            var modules = config.modules[selector];
            var container = target.querySelector('#' + selector);

            if (typeof modules === 'string') {
                M(container, modules, dataCtx, function () {
                    self.emit("ready");
                });
            }
            // assuming an array
            else if (modules.length) {
                // start finding the first accessible miid in the module array
                tryNextModule(modules, 0, container, dataCtx, self);
            }
        }

        if (!config.modules || !config.modules.length) {
            self.emit("ready");
        }
    }

    function removeLoadedModules () {

        for (var selector in config.modules) {
            if (!config.modules.hasOwnProperty(selector)) return;

            var container = target.querySelector("#" + config.modules[selector]);
            $(container).remove();
        }
    }

    loadModules(dataContext);

    // set document title
    if (config.title) {
        document.title = config.title;
    }

/***********************************************/
/* Module functions TODO find another solution */
/***********************************************/

    // TODO Only two arguments (arrays):
    //      1. Dynamic arguments
    //      2. Configured arguments (from descriptor)
    this.reload = function (dataCtx) {
        removeLoadedModules();
        loadModules(dataCtx);
    };

    this.show = function () {
        $(self.dom).parent().show();
    }

    this.hide = function () {
        $(self.dom).parent().hide();
    }
/***********************************************/

    // run the binds
    for (var i in config.binds) {
        if (!config.hasOwnProperty(i)) return;
        Bind.call(self, config.binds[i]);
    }

    if (typeof window[config.onInitEnd] === 'function') {
        window[config.onInitEnd].apply(self);
    }
};
