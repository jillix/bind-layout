'use strict';

var Bind = require('github/adioo/bind');

// a recursive function until a module
function tryNextModule (miids, index, container) {
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

module.exports = function (config) {

    var target = this && this.dom ? this.dom : document;

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
            tryNextModule(modules, 0, container);
        }
    }

    // set document title
    if (config.title) {
        document.title = config.title;
    }

    // run the binds
    for (var i in config.binds) {
        Bind.call(self, config.binds[i]);
    }

    if (typeof this.onload === 'function') {
        this.onload();
    }
};

