define([
		// Libraries.
		"jquery",
		"backbone",
		"handlebars",
		"app",
		"packery",

		'views/story-item',
		"views/tell-your-story_small",
		"views/filter",

		// Plugins.
		"plugins/backbone.layoutmanager"
	],
	function($, Backbone, Handlebars, app, Packery, StoryItemView, TellYourStorySmallView, FilterView) {
		var View = Backbone.LayoutView.extend({


			className: "grid--view",

			imageUpload: null,

			tags: null,

			events: {
			},

			initialize: function(attrs) {
				this.tagsCollection = attrs.tags;
				this.storiesCollection = attrs.stories;

				console.log('!!');

				this.storiesCollection.on('sync', this.stories_changeHandler, this);
			},

			stories_changeHandler: function (argument) {
				var self = this;
				console.log('chaaange');
				self.pckry.remove($(self.el).find('.story-item--view'));
				self.pckry.layout();

				//Insert stories
				setTimeout(function() {
					self.storiesCollection.sort(this.comparator).forEach(function(model) {
						self.insertView(new StoryItemView({model:model})).render();
					});

					self.pckry.appended($(self.el).find('.story-item--view'));
					self.pckry.layout();
				},500);
			},

			beforeRender: function (argument) {
				var self = this;

				self.filterView = new FilterView({collection:this.tagsCollection, stories:this.storiesCollection});
				self.tellYourStorySmallView = new TellYourStorySmallView({collection:this.tagsCollection});

				//Insert filter and tell your story views
				this.insertViews({
					'': self.tellYourStorySmallView
				});
				this.insertViews({
					'': self.filterView
				});

				//Insert stories
				self.storiesCollection.sort(this.comparator).forEach(function(model) {
					self.insertView(new StoryItemView({model:model}));
				});

				//Insert sizers
				// $(this.el).append('<div class="grid-sizer"></div>');
			},

			afterRender: function() {
				var self = this;
				self.pckry = new Packery( $(this.el)[0], {
					itemSelector: '.item',
					gutter: 0,
					stamp:'.tell-your-story--small--view, .filter--view'
				});
			},

			serialize: function() {
				return {
					stories:this.storiesCollection.toJSON(),
					tags:this.tagsCollection.toJSON()
				};
			}
		});

		return View;
	}
);