define([
		// Libraries.
		"jquery",
		"backbone",
		"handlebars",
		"app",

		"views/story-item",

		"slick"
	],
	function($, Backbone, Handlebars, app, StoryItemView) {
		var View = Backbone.LayoutView.extend({

			// template: "story",

			className: "story--view",

			events: {
			},

			initialize: function(attrs) {
				this.storyId = attrs.storyId;
				this.fetchedStory = attrs.fetchedStory;
			},

			afterRender: function() {
				var self = this;

				this.addElements(function () {
					$(self.el).slick({
						initialSlide: $(self.el).find('div[data-id="'+self.storyId+'"]').index() || 0,
						dots: false,
						speed: 500,
						infinite: false,
						slidesToShow:3,
						slidesToScroll: 1,
						centerMode: true,
						swipeToSlide: true,
						accessibility: true,
						responsive: [
							{
								breakpoint:768,
								settings: {
									slidesToShow:1
								}
							}
						],
						onAfterChange: function () {
							app.router.navigate("story/"+$(self.el).find('div.slick-center').data('id'), {trigger: false});
						},
						onInit: function () {
						}
					});
				});
			},

			addElements: function (callback) {
				var self = this;
				var views = [];

				if ( ! self.fetchedStory ) {
					self.collection.forEach(function(model) {
						self.insertView(new StoryItemView({model:model})).render();
					});
				} else {
					self.insertView(new StoryItemView({model:self.fetchedStory})).render();
				}


				setTimeout(function() {
					callback();
				},100);
			},

			beforeRender: function () {
				var self = this;
			},

			setStory: function (storyId) {
				console.log('handle change in modal focus');
				$(this.el).slickGoTo($(this.el).find('div[data-id="'+storyId+'"]').attr('index'));
			}
		});

		return View;
	});