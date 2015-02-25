define([
		// Libraries.
		"jquery",
		"backbone",
		"handlebars",
		"app",
		'text-rotator',

		// Plugins.
		"validate",
		"cloudinary",
		"plugins/backbone.layoutmanager"
	],
	function($, Backbone, Handlebars, app) {
		var View = Backbone.LayoutView.extend({

			template: "tell-your-story_small",

			className: "item tell-your-story--small--view",

			imageUpload: null,

			tags: null,

			events: {
				'click': 'this_clickHandler'
			},

			this_clickHandler: function (e) {
				e.preventDefault();
				console.log('!');
				app.trigger('modal:tellyourstory');
			},

			initialize: function() {
			},

			afterRender: function() {
				$(this.el).find('.rotate').textrotator({
					animation: "flipUp",
					speed: 1750
				});
			},

			serialize: function() {
			}
		});

		return View;
	});