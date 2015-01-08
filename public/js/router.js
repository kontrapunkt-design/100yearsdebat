define([
		// Application
		"app",

		//Views
		"views/tell-your-story"
	],

	function(
		app,
		TellYourStoryView
		) {
		// Defining the application router, you can attach sub routers here.
		var Router = Backbone.Router.extend({
			routes: {
				"": "index"
			},

			initialize: function() {
				var self = this;

				console.log('init');

				app.useLayout("canvas").setViews({
					".canvas--tell-your-story": new TellYourStoryView({})
					// ".canvas--filter": new SlidesView({collection:self.slidesCollection}),
				}).render(function() {});
			},

			index: function() {
				console.log('index');
			}
		});

		return Router;
	}
);