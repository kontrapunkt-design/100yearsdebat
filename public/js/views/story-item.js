define([
		// Libraries.
		"jquery",
		"backbone",
		"handlebars",
		"app",
		"jquery.fitvids"
	],
	function($, Backbone, Handlebars, app) {
		var View = Backbone.LayoutView.extend({

			template: "story-item",

			className: "item story-item--view",

			manage:true,

			fbCommentsInitialized: false,

			active: false,

			events: {
				'click':'this_clickHandler',
				'click .close-btn':'this_closeHandler',
				'click .embed-video':'embedVideo_clickHandler'
			},

			this_clickHandler: function () {
				if ( this.singleStory ) {
					return false;
				}
				app.router.navigate("story/"+this.model.get('_id'), {trigger: true});
			},

			this_closeHandler: function (e) {
				e.preventDefault();
				app.trigger('modal:close');
			},

			embedVideo_clickHandler: function (e) {
				if ( this.singleStory && this.model.get('youtube') ) {
					$(this.el).find('.embed-video').addClass('playing');
					$(this.el).find('.embed-video--player').addClass('playing');
					$(this.el).find('.embed-video--player').html('<iframe width="600" height="337" src="http://www.youtube.com/embed/'+this.model.get('youtube')+'?autoplay=1" frameborder="0" allowfullscreen></iframe>');
					$(this.el).find('.embed-video--player').fitVids();
				}
			},

			stopVideo: function (argument) {
				$(this.el).find('.embed-video').removeClass('playing');
				$(this.el).find('.embed-video--player').removeClass('playing');
				$(this.el).find('.embed-video--player').html('');
			},

			initialize: function(attrs) {
				this.singleStory = attrs.singleStory;

				this.model.on('fetched:commentCount', this.fbComments_fetchedHandler, this);
			},

			fbComments_fetchedHandler: function () {
				$(this.el).find('.fb-comment-count').text(this.model.get('commentCount'));
			},

			beforeRender: function() {
				$(this.el).attr('data-id',this.model.get('_id'));

				if ( ! this.singleStory && this.model.get('featureStory') === true ) {
					$(this.el).addClass('featured');
				}
			},

			setActive: function () {
				this.active=true;
				if ( ! this.fbCommentsInitialized ) {
					FB.XFBML.parse($(this.el).find('.fb-comments')[0]);
					this.fbCommentsInitialized=true;
				}
			},

			setInactive: function () {
				if ( this.active ) {
					this.active=false;

					if ( this.singleStory && this.model.get('youtube') ) {
						this.stopVideo();
					}
				}
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