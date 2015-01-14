define([
		// Libraries.
		"jquery",
		"backbone",
		"handlebars",
		"app"
	],
	function($, Backbone, Handlebars, app) {
		var View = Backbone.LayoutView.extend({

			template: "story-item",

			className: "item story-item--view",

			manage:true,

			events: {
				'click':'this_clickHandler'
			},

			this_clickHandler: function (argument) {
				app.router.navigate("story/"+this.model.get('_id'), {trigger: true});
			},

			initialize: function() {
			},

			afterRender: function() {
				$(this.el).attr('data-id',this.model.get('_id'));
			},

			serialize: function() {
				return {
					model:this.model.toJSON()
				};
			}
		});

		return View;
	});