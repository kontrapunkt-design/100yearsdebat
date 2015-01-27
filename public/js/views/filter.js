define([
		// Libraries.
		"jquery",
		"backbone",
		"handlebars",
		"app"
	],
	function($, Backbone, Handlebars, app) {
		var View = Backbone.LayoutView.extend({

			template: "filter",

			className: "item filter--view",

			events: {
				'click .filter--tags a':'tag_clickHandler',
				'click .btn-remove-filering':'btnRemoveFiltering_clickHandler'
			},

			btnRemoveFiltering_clickHandler: function (argument) {
				$(this.el).find('.filter--tags a').removeClass('selected');
				$(this.el).find('.btn-remove-filering').addClass('hide');

				this.storiesCollection.setTagIdFilter(null);
				this.storiesCollection.fetch();
			},

			tag_clickHandler: function (e) {
				e.preventDefault();
				$(this.el).find('.filter--tags a').removeClass('selected');
				$(this.el).find('.btn-remove-filering').removeClass('hide');

				$(e.target).addClass('selected');

				this.storiesCollection.setTagIdFilter($(e.target).data('id'));
				this.storiesCollection.fetch();
			},

			initialize: function(attrs) {
				this.storiesCollection = attrs.stories;
			},

			afterRender: function() {
			},

			serialize: function() {
				return {
					tags:this.collection.toJSON()
				};
			}
		});

		return View;
	});