// Set the require.js configuration for your application.
require.config({

    // Initialize the application with the main application file.
    deps: ["main"],

    paths: {
        // JavaScript folders.
        libs: "libs",

        // Libraries.
        jquery: "libs/jquery",
        lodash: "libs/lodash",
        backbone: "libs/backbone",
        handlebars: "libs/handlebars"
    },

    shim: {
        // Backbone library depends on lodash and jQuery.
        backbone: {
            deps: ["lodash", "jquery"],
            exports: "Backbone"
        },

        handlebars: {
            exports: 'Handlebars'
        },

        // Backbone.LayoutManager depends on Backbone.
        "plugins/backbone.layoutmanager": ["backbone"]
    }

});