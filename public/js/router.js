define([
		// Application
		"app",

		//Views
		"views/tell-your-story",
		"views/grid",
		"views/story",

		//Models + Collections
		"collections/tags",
		"collections/stories",

		"cloudinary",
		"modal"
	],

	function(
		app,
		TellYourStoryView,
		GridView,
		StoryView,
		TagsCollection,
		StoriesCollection
		) {
		// Defining the application router, you can attach sub routers here.
		var Router = Backbone.Router.extend({
			modalOpen: false,

			routes: {
				"": "index",
				"story/:storyId": "story"
			},

			initialize: function() {
				var self = this;

				console.log('init');

				//Init cloudinary
				$.cloudinary.config({ cloud_name: 'diin', api_key: '967225847829495'});

				//Set tags-collection
				self.tagsCollection = new TagsCollection(window.app.tags);
				self.storiesCollection = new StoriesCollection(window.app.stories);

				//Story view
				$.modal({
					cloning:false,
					closeOnEsc:true,
					closeOnOverlayClick: false,
					onBeforeClose: function() {
						app.router.navigate('/', {trigger: true});
						return true;
					}
				});

				//Set standard layout
				app.useLayout("app").setViews({
					".grid": new GridView({tags:self.tagsCollection,stories:self.storiesCollection})
				}).render(function() {
					Backbone.history.start({ pushState: true, root: app.root });
				});
			},

			index: function() {
				console.log('index');

				$('#modal').modal().close();
				this.modalOpen=false;
			},

			story: function(storyId) {
				var self = this;

				console.log('shiiit');
				if ( ! this.modalOpen ) {
					self.storyView = new StoryView({collection:self.storiesCollection, storyId:storyId});

					$('#layout').append('<div class="modal" id="modal" style="display:none"></div>');

					app.layout.setView(
						'#modal', self.storyView
					).render(function() {
						$('#modal').modal().open();
						self.modalOpen=true;
					});

				} else {
					//handle change in modal focus
					self.storyView.setStory(storyId);
				}
			}
		});

		return Router;
	}
);