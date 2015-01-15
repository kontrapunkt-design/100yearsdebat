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
							var slideId = $(self.el).find('div.slick-center').data('id');
							app.router.navigate("story/"+slideId, {trigger: false});
							self.views[slideId].setActive();
						},
						onInit: function () {
							self.firstSlide.setActive();
						}
					});
				});
			},

			addElements: function (callback) {
				var self = this;
				var view;
				this.views = [];

				if ( ! self.fetchedStory ) {
					self.collection.forEach(function(model) {

						view = new StoryItemView({model:model, singleStory:true});
						self.views[model.get('_id')]=view;
						
						if ( model.get('_id') === self.storyId ) {
							self.firstSlide = view;
						}
						
						self.insertView(view).render();
					});
				} else {
					view = new StoryItemView({model:self.fetchedStory, singleStory:true});
					self.views[model.get('_id')]=view;

					if ( model.get('_id') === self.storyId ) {
						self.firstSlide = view;
					}

					self.insertView(view).render();
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