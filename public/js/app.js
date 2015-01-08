define([
        // Libraries.
        "jquery",
        "lodash",
        "backbone",
        "handlebars",

        // Plugins.
        "plugins/backbone.layoutmanager"
    ],

    function($, _, Backbone, Handlebars, Utils) {

        // Provide a global location to place configuration settings and module
        // creation.
        var app = {
            // The root path to run the application.
            root: "/"
        };

        // Localize or create a new JavaScript Template object.
        var JST = window.JST = window.JST || {};

        // Configure LayoutManager with Backbone Boilerplate defaults.
        Backbone.LayoutManager.configure({
            paths: {
                layout: "/templates/layouts/",
                template: "/templates/"
            },

            fetch: function(path) {
                var done;

                // Add the html extension.
                path = path + ".html";

                // If the template has not been loaded yet, then load.
                if (!JST[path]) {
                    done = this.async();
                    return $.ajax({
                        url: path
                    }).then(function(contents) {
                        JST[path] = Handlebars.compile(contents);
                        JST[path].__compiled__ = true;

                        done(JST[path]);
                    });
                }

                // If the template hasn't been compiled yet, then compile.
                if (!JST[path].__compiled__) {
                    JST[path] = Handlebars.template(JST[path]);
                    JST[path].__compiled__ = true;
                }

                return JST[path];
            }
        });

        // Mix Backbone.Events, modules, and layout management into the app object.
        return _.extend(app, {
            // Create a custom object with a nested Views object.
            module: function(additionalProps) {
                return _.extend({
                    Views: {}
                }, additionalProps);
            },

            // Helper for using layouts.
            useLayout: function(name) {
                // If already using this Layout, then don't re-inject into the DOM.
                if (this.layout && this.layout.options.template === name) {
                    return this.layout;
                }

                // If a layout already exists, remove it from the DOM.
                if (this.layout) {
                    this.layout.remove();
                }

                // Create a new Layout.
                var layout = new Backbone.Layout({
                    template: name,
                    className: "layout " + name,
                    id: "layout"
                });

                // Insert into the DOM.
                $("#canvas").empty().append(layout.el);

                // Render the layout.
                layout.render();

                // Cache the refererence.
                this.layout = layout;

                // Return the reference, for chainability.
                return layout;
            }
        }, Backbone.Events);

    });