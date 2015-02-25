define([
		// Libraries.
		"jquery",
		"backbone",
		"handlebars",
		"app",
		"ZeroClipboard",
		"jquery.cookie",
		"jquery.fitvids"
	],
	function($, Backbone, Handlebars, app, ZeroClipboard) {
		var View = Backbone.LayoutView.extend({

			template: "story-item",

			className: "item story-item--view",

			manage:true,

			fbCommentsInitialized: false,

			active: false,

			pollQuestions: null,
			pollTotalVotes: 0,

			events: {
				'click':'this_clickHandler',
				'click .close-btn':'this_closeHandler',
				'click .embed-video':'embedVideo_clickHandler',
				'click .answer-item': 'answerItem_clickHandler',
				'click .share-btn': 'shareBtn_clickHandler'
			},

			shareBtn_clickHandler: function (e) {
				e.preventDefault();
				var self = this;
				ga('send', 'event', 'button', 'click', 'shareStoryInit', self.model.get('_id'));
				FB.ui({
					method: 'share',
					href: 'http://debat.100aaret.dk/story/'+this.model.get('_id')
				}, function(response){
					if (response && !response.error_code) {
						ga('send', 'event', 'button', 'click', 'shareStoryDone', self.model.get('_id'));
					} else {
						ga('send', 'event', 'button', 'click', 'shareStoryFailed', self.model.get('_id'));
					}
				});
			},

			answerItem_clickHandler: function (e) {
				e.preventDefault();
				ga('send', 'event', 'button', 'click', 'pollVote', {'storyId':this.model.get('_id')});
				this.model.pollVote(Number($(e.currentTarget).data('id')));
			},

			this_clickHandler: function (e) {
				if ( $(e.target).parent().hasClass('share-btn') || $(e.target).hasClass('share-btn') ) {
					return false;
				}

				var cookieVoteId = $.cookie('pollVote'+this.model.get('_id'));
				if ( this.singleStory ||( this.model.get('type') === 'poll' && ! cookieVoteId) ) {
					return false;
				}
				app.router.navigate("story/"+this.model.get('_id'), {trigger: true});
			},

			this_closeHandler: function (e) {
				e.preventDefault();
				this.setInactive();
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

				this.model.on('fetched:socialCount', this.socialCount_fetchedHandler, this);
				this.model.on('pollChange', this.render, this);
			},

			socialCount_fetchedHandler: function () {
				$(this.el).find('.fb-comment-count').text(this.model.get('commentCount'));
				$(this.el).find('.fb-likes').text(this.model.get('shareCount'));
			},

			beforeRender: function() {
				$(this.el).attr('data-id',this.model.get('_id'));

				if ( ! this.singleStory && this.model.get('featureStory') === true ) {
					$(this.el).addClass('featured');
				}

				//Poll
				if ( this.model.get('type') === 'poll' ) {
					$(this.el).addClass('poll');

					var cookieVoteId = $.cookie('pollVote'+this.model.get('_id'));

					if ( cookieVoteId ) {
						$(this.el).addClass('results');
					}

					this.pollTotalVotes=(this.model.get('answer1Votes') || 0) + (this.model.get('answer2Votes') || 0) + (this.model.get('answer3Votes') || 0) + (this.model.get('answer4Votes') || 0);

					this.pollQuestions=[];

					if ( this.model.get('answer1') ) {
						this.pollQuestions.push({
							id:1,
							answer:this.model.get('answer1'),
							votes:this.model.get('answer1Votes') || 0,
							procentage:Math.round((this.model.get('answer1Votes') || 0) / this.pollTotalVotes*100),
							selected: cookieVoteId == '1' ? true : false
						});
					}
					if ( this.model.get('answer2') ) {
						this.pollQuestions.push({
							id:2,
							answer:this.model.get('answer2'),
							votes:this.model.get('answer2Votes') || 0,
							procentage:Math.round((this.model.get('answer2Votes') || 0) / this.pollTotalVotes*100),
							selected: cookieVoteId == '2' ? true : false
						});
					}
					if ( this.model.get('answer3') ) {
						this.pollQuestions.push({
							id:3,
							answer:this.model.get('answer3'),
							votes:this.model.get('answer3Votes') || 0,
							procentage:Math.round((this.model.get('answer3Votes') || 0) / this.pollTotalVotes*100),
							selected: cookieVoteId == '3' ? true : false
						});
					}
					if ( this.model.get('answer4') ) {
						this.pollQuestions.push({
							id:4,
							answer:this.model.get('answer4'),
							votes:this.model.get('answer4Votes') || 0,
							procentage:Math.round((this.model.get('answer4Votes') || 0) / this.pollTotalVotes*100),
							selected: cookieVoteId == '4' ? true : false
						});
					}
				}
			},

			afterRender: function () {
				var self = this;

				app.trigger('grid:relayout');

				//Set copy btn
				var client = new ZeroClipboard( $(this.el).find('.copy-url-btn')[0] );

				client.on( "ready", function( readyEvent ) {
					client.on( "copy", function (event) {
						var clipboard = event.clipboardData;
						clipboard.setData( "text/plain", window.location.origin + '/story/' + self.model.get('_id') );
					});

					client.on( "aftercopy", function( event ) {
						window.alert('URL til historien er kopieret.');
					});
				} );

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
					singleStory: this.singleStory,
					poll: this.model.get('type') === 'poll' ? true : false,
					pollQuestions: this.pollQuestions
				};
			}
		});

		return View;
	});