'use strict';

var Bind = require('github/jxmono/bind');
var Events = require('github/jxmono/events');

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
            if (!config.modules.hasOwnProperty(selector)) continue;

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
            if (!config.modules.hasOwnProperty(selector)) continue;

            var container = target.querySelector("#" + config.modules[selector]);
            $(container).remove();
        }
    }

    loadModules(dataContext);

    // set document title
    if (config.title) {
        document.title = config.title[M.getLocale()] || config.title;
    }

    // run the binds
    if (config.binds) {
        for (var i = 0; i < config.binds.length; ++i) {
            Bind.call(self, config.binds[i]);
        }
    }
};
