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

		"imagesloaded",

		// Plugins.
		"plugins/backbone.layoutmanager"
	],
	function($, Backbone, Handlebars, app, Packery, StoryItemView, TellYourStorySmallView, FilterView) {
		var View = Backbone.LayoutView.extend({


			className: "grid--view",

			imageUpload: null,

			tags: null,

			modelIdsInView: null,

			filterRefresh: false,

			events: {
			},

			initialize: function(attrs) {
				this.tagsCollection = attrs.tags;
				this.storiesCollection = attrs.stories;

				console.log('!!');

				// this.storiesCollection.on('add', this.stories_addHandler, this);
				this.storiesCollection.on('sync', this.stories_addHandler, this);
				this.storiesCollection.on('filter:change', this.stories_filterChangeHandler, this);
				app.on('grid:relayout', this.grid_relayoutHandler, this);
			},

			grid_relayoutHandler: function () {
				this.pckry.layout();
			},

			stories_addHandler: function () {
				var self = this;
				console.log('stories_addHandler');

				if ( this.filterRefresh ) {
					self.modelIdsInView=[];
					self.pckry.remove($(self.el).find('.story-item--view'));
					self.pckry.layout();

					this.filterRefresh=false;
				}

				var addedStories = 0;

				setTimeout(function() {
					self.storiesCollection.sort(this.comparator).forEach(function(model) {
						if ( ! self.modelIdsInView[model.get('_id')] ) {
							self.modelIdsInView[model.get('_id')]=true;
							self.insertView(new StoryItemView({model:model})).render(function(el) {
								self.pckry.appended(el);
							});
							addedStories++;
						}
					});
					if ( addedStories === 0 ) {
						$('.grid--load-more').addClass('hide');
					}
					self.pckry.layout();
				}, 500);
			},

			stories_filterChangeHandler: function (argument) {
				$('.grid--load-more').removeClass('hide');
				this.filterRefresh=true;
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
				self.modelIdsInView=[];
				self.storiesCollection.sort(this.comparator).forEach(function(model) {
					self.modelIdsInView[model.get('_id')]=true;
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

				if ( $(this.el).imagesLoaded ) {
					$(this.el).imagesLoaded(function() {
						self.pckry.layout();
					});
				}

				$('.grid--load-more').on('click touchend', function(e) {
					self.gridLoadMore_clickHandler(e);
				});
			},

			gridLoadMore_clickHandler: function (e) {
				e.preventDefault();
				this.storiesCollection.fetchMore();
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