define([
		// Libraries.
		"jquery",
		"backbone",
		"handlebars",
		"app",

		"plugins/backbone.layoutmanager"
	],
	function($, Backbone, Handlebars, app) {
		var View = Backbone.LayoutView.extend({

			template: "om-page",

			className: "text-page--view story-item--view",

			events: {
				'click .close-btn':'this_closeHandler',
			},

			this_closeHandler: function (e) {
				e.preventDefault();
				app.trigger('modal:close');
			},

			serialize: function() {
				return {};
			}
		});

		return View;
	});