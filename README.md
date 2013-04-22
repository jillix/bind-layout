Mono Layout Module
==================

This ia a layout module for the Mono web framework.

Configuration
-------------

Besides the standard Mono module configuration options ('html', 'css', 'scripts'), the extra configuration options for this module are:

```
{
    "title": "Test Title",

    "modules": {
        "domElemId1": "miid1",
        "domElemId2": ["miid2", "alternativeMiid", "errorMiid"]
    },

    "binds": [BIND_OBJECT]
}
```

where:

  * **title**: the title that this layout module will give to the document
  * **modules**: an object containing DOM element IDs as keys and the corresponding `miid` as values. If the value is an array, the layout will try to load the modules in order until one is successfull. This can be the case when the user is not yet logged in and instead of a module, a login or error module will be displayed.
  * **binds**: an array of bind objects as described by the [Bind module](https://github.com/adioo/bind)

