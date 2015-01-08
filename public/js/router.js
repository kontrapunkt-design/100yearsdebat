define([
		// Application
		"app",

		//Views
		"views/tell-your-story",

		"cloudinary"
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

				//Init cloudinary
				$.cloudinary.config({ cloud_name: 'diin', api_key: '967225847829495'});

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