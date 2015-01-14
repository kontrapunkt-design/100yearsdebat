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
        handlebars: "libs/handlebars",
        deepmodel: "libs/deep-model",

        validate: "libs/jquery.validate",

        modal: "libs/jquery.the-modal",
        
        "packery": "libs/packery.pkgd",
        
        "slick": "libs/slick",

        "jquery.iframe-transport": "libs/jquery.iframe-transport",
        "jquery.ui.widget": "libs/jquery.ui.widget",
        "jquery.fileupload": "libs/jquery.fileupload",
        "cloudinary": "libs/jquery.cloudinary"
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

        'modal': ['jquery'],

        'slick': ['jquery'],

        'jquery.ui.widget': ['jquery'],
        'jquery.iframe-transport': ['jquery'],
        'jquery.fileupload': ['jquery','jquery.iframe-transport','jquery.ui.widget'],
        'cloudinary': ['jquery','jquery.fileupload'],

        // Backbone.LayoutManager depends on Backbone.
        "plugins/backbone.layoutmanager": ["backbone"]
    }

});