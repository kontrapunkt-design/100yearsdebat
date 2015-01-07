define([
		// Application
		"app"
	],

	function(
		app
		) {
		// Defining the application router, you can attach sub routers here.
		var Router = Backbone.Router.extend({
			routes: {
				"": "index"
			},

			initialize: function() {
				var self = this;

				console.log('init');
			},

			index: function() {
				console.log('index');
			}
		});

		return Router;
	}
);