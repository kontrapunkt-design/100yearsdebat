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

			fbCommentsInitialized: false,

			events: {
				'click':'this_clickHandler'
			},

			this_clickHandler: function () {
				app.router.navigate("story/"+this.model.get('_id'), {trigger: true});
			},

			initialize: function(attrs) {
				this.singleStory = attrs.singleStory;
			},

			afterRender: function() {
				$(this.el).attr('data-id',this.model.get('_id'));
			},

			setActive: function () {
				if ( ! this.fbCommentsInitialized ) {
					FB.XFBML.parse($(this.el).find('.fb-comments')[0]);
					this.fbCommentsInitialized=true;
				}
			},

			setInactive: function () {
				
			},

			serialize: function() {
				return {
					model:this.model.toJSON(),
					singleStory: this.singleStory
				};
			}
		});

		return View;
	});