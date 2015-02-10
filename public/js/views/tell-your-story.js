define([
		// Libraries.
		"jquery",
		"backbone",
		"handlebars",
		"app",

		// Plugins.
		"validate",
		"cloudinary",
		"plugins/backbone.layoutmanager"
	],
	function($, Backbone, Handlebars, app) {
		var View = Backbone.LayoutView.extend({

			template: "tell-your-story",

			className: "tell-your-story--view",

			imageUpload: null,

			tags: [],

			facebookId: null,
			facebookName: null,
			facebookEmail: null,
			youtubeId: null,
			storyId: null,
			canSubmit: false,

			events: {
				'submit .tell-your-story_form':'form_submitHandler',
				'click .tell-your-story--submit':'form_submitHandler',
				'submit .tell-your-story_form--tags': 'customTags_submit',
				'click .close-btn.modal-close':'this_closeHandler',
				'click .tell-your-story--tags a': 'tag_clickHandler',
				'click a.add-video': 'addVideo_clickHandler',
				'click .story-image .remove-btn': 'storyImageVideoRemoveBtn_clickHandler',
				'click .fb-connect' : 'fbConnect_clickHandler',
				'click .tell-your-story--video-modal .close-btn': 'videoModalCloseBtn_clickHandler',
				'submit .tell-your-story_form--video': 'videoModal_submitHandler',
				'click .tell-your-story--video-modal--submit-btn': 'videoModal_submitHandler',
				'click .tell-your-story--share' : 'facebookShareBtn_clickHandler',
				'click .email-instead-btn': 'emailInsteadBtn_clickHandler'
				// 'focus .input-story': 'inputStory_focusHandler',
				// 'blur .input-story': 'inputStory_blurHandler'
			},

			checkForm: function () {
				this.countTags();
				$(this.el).find('.tell-your-story--submit').removeClass('clickable');
				this.canSubmit=false;
				if ( $(this.el).find('.input-story').val().length > 0 && ( this.facebookId || ($(this.el).find('.input-email-wrapper').hasClass('valid') && $(this.el).find('.input-name-wrapper').hasClass('valid'))) ) {
					this.canSubmit=true;
					$(this.el).find('.tell-your-story--submit').addClass('clickable');
				}
				$(this.el).find('.tell-your-story_form--tags').removeClass('error');
				if ( this.tags.length === 0 ) {
					this.canSubmit=false;
					$(this.el).find('.tell-your-story_form--tags').addClass('error');
					$(this.el).find('.tell-your-story--submit').removeClass('clickable');
				}
			},

			/*inputStory_focusHandler: function () {
				var $inputStory = $(this.el).find('.input-story');
				if ( $inputStory.val() === $inputStory.data('placeholder') ) {
					$inputStory.val('');
				}
			},

			inputStory_blurHandler: function () {
				var $inputStory = $(this.el).find('.input-story');
				if ( $inputStory.val().length == 0 ) {
					$inputStory.val($inputStory.data('placeholder'));
				}
			},*/

			emailInsteadBtn_clickHandler: function (e) {
				e.preventDefault();
				$(this.el).find('.email-wrapper').removeClass('hide');
				$(this.el).find('.fb-connect').addClass('hide');
				$(this.el).find('.email-instead-btn').addClass('hide');
			},

			videoModal_submitHandler: function (e) {
				e.preventDefault();
				var self = this;
				var youtubeUrl = $(this.el).find('.tell-your-story--video-modal--input').val();
				var youtubeId = this.parseYoutubeURL(youtubeUrl);

				if ( youtubeId ) {
					this.imageUpload=null;
					this.youtubeId=youtubeId;
					$(this.el).find('.tell-your-story--video-modal').removeClass('open');
					$(self.el).find('.story-image img').remove();
					$(self.el).find('.story-image').addClass('has-video').append('<img src="http://img.youtube.com/vi/'+youtubeId+'/mqdefault.jpg" width="100%"/>');
				} else {
					$(this.el).find('.tell-your-story--video-modal--input').val('Fejl i din Youtube URL');
					setTimeout(function () {
						$(self.el).find('.tell-your-story--video-modal--input').val(youtubeUrl);
					},1500);
				}
			},

			parseYoutubeURL: function(url) {
				var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
				var match = url.match(regExp);

				if (match&&match[7].length==11){
					return match[7];
				}else{
					console.log("Utils: parseYoutubeURL: Can't parse URL");
					return null;
				}
			},

			videoModalCloseBtn_clickHandler: function (e) {
				e.preventDefault();
				$(this.el).find('.tell-your-story--video-modal').removeClass('open');
			},

			storyImageVideoRemoveBtn_clickHandler: function (e) {
				console.log('yoo');
				e.preventDefault();
				this.imageUpload=null;
				this.youtubeId=null;
				$(this.el).find('.story-image').removeClass('has-image has-video').find('img').remove();
			},

			this_closeHandler: function (e) {
				e.preventDefault();
				app.trigger('modal:close');
			},

			fbConnect_clickHandler: function (e) {
				var self = this;

				e.preventDefault();
				
				FB.login(function (res) {
					if (res.status === 'connected') {
						FB.api('/me', function(response) {
							self.facebookId=response.id;
							self.facebookName=response.first_name;
							self.facebookEmail=response.email;
							$(self.el).find('.author-input').addClass('hide');
							$(self.el).find('.facebook-author').removeClass('hide');
							$(self.el).find('.facebook-author .name').text(response.first_name);
							$(self.el).find('.facebook-author--img').css('background-image','url(http://graph.facebook.com/'+response.id+'/picture)');
							self.checkForm();
						});
					}
				}, {scope: 'public_profile,email'});
			},

			addVideo_clickHandler: function (e) {
				e.preventDefault();
				$(this.el).find('.tell-your-story--video-modal').addClass('open');
				$(this.el).find('.tell-your-story--video-modal input').focus();
			},

			countTags: function (callback) {
				var callback = callback || function(){};
				var self = this;
				self.tags = [];
				$(this.el).find('.tell-your-story--tags a.selected').each(function (i, tagItem) {
					if ( $(tagItem).data('id') ) {
						self.tags.push({
							id:$(tagItem).data('id')
						});
					} else {
						self.tags.push({
		    				name:$(tagItem).data('name')
		    			});
					}
				});
				callback();
			},

			form_submitHandler: function (e) {
				var self = this;
				e.preventDefault();

				$(this.el).find('.tell-your-story_form--tags').removeClass('error');

				this.countTags(function() {
					if ( self.tags.length === 0 ) {
						$(self.el).find('.tell-your-story_form--tags').addClass('error');
						return false;
					}

					if ( !self.canSubmit ) {
						return false;
					}

					$.ajax({
						url: window.location.origin + '/api/stories',
						type: 'POST',
						data: {
							story:$(self.el).find('.input-story').val(),
							email:self.facebookId ? self.facebookEmail : $(self.el).find('.input-email').val(),
							tags:self.tags,
							facebookId: self.facebookId || null,
							authorName: self.facebookName || $(self.el).find('.input-name').val() || null,
							youtube: self.youtubeId || null,
							image:self.imageUpload || null
						},
						success: function (data) {
							if ( data.result === 'ok' ) {
								self.showDoneState(data.story);
							} else {
								console.log('Tell your story:: Submit:: Erorr occured on the backend.')
							}
						}
					});
				});
			},

			showDoneState: function (story) {
				var $stateDone = $(this.el).find('.state-done');

				this.storyId = story._id;

				ga('send', 'pageview', '/tellyourstory/done');

				//Set width
				$(this.el).css('max-width','708px');

				$(this.el).find('.state-submit').addClass('hide');
				$stateDone.removeClass('hide');

				$stateDone.find('.text p').text(story.story);
				
				$stateDone.find('.story-link').text('taligestilling.herokuapp.com/story/'+this.storyId);
				$stateDone.find('.story-link').attr('href', 'http://taligestilling.herokuapp.com/story/'+this.storyId);

				if ( story.image ) {
					$stateDone.find('.embed-video').prepend($.cloudinary.image(story.image.public_id, { width: 453 }));
					$stateDone.find('.embed-video .play-btn').remove();
				} else if ( story.yotube ) {
					$stateDone.find('.embed-video').prepend('<img src="http://img.youtube.com/vi/'+story.youtube+'/mqdefault.jpg" width="100% />');
				} else {
					$stateDone.find('.embed-video').remove();
				}

				if ( story.facebookId ) {
					$stateDone.find('.author').prepend('<img class="author--profile" src="http://graph.facebook.com/'+story.facebookId+'/picture" alt="'+story.authorName+'" />');
					$stateDone.find('.author .author--name').text(story.authorName);
				} else {
					$stateDone.find('.author .author--name').text(story.authorName);
				}
			},

			facebookShareBtn_clickHandler: function (e) {
				e.preventDefault();
				FB.ui({
					method: 'share',
					href: 'http://taligestilling.herokuapp.com/story/'+this.storyId
				}, function(response){});
			},

			tag_clickHandler: function (e) {
				e.preventDefault();
				$(e.currentTarget).toggleClass('selected');
				
				this.checkForm();
			},

			customTags_submit: function (e) {
				var self = this;

				e.preventDefault();
				var newTagVal = $(this.el).find('.custom-tag').val().split('#').join('').split('.').join('').split(',').join('');

				if ( newTagVal.length > 0 && $(self.el).find('.tell-your-story--tags a[data-name="'+newTagVal+'"]').length ==0 ) {
					self.checkForTag(newTagVal, function (tag) {
						if ( tag ) {
							$(self.el).find('.tell-your-story--tags').append('<a data-id="'+tag.id+'" data-name="'+tag.name+'" class="selected">#'+tag.name+' ('+tag.storyCount+')</a>');
						} else {
							$(self.el).find('.tell-your-story--tags').append('<a data-name="'+newTagVal+'" class="selected">#'+newTagVal+' (0)</a>');
						}
					});
				} else if ( $(self.el).find('.tell-your-story--tags a[data-name="'+newTagVal+'"]').length == 1 ) {
					$(self.el).find('.tell-your-story--tags a[data-name="'+newTagVal+'"]').addClass('selected');
				}
				
				$(this.el).find('.custom-tag').val('').focus();
			},

			checkForTag: function (tag, callback) {
				$.get('/api/tags/search/'+encodeURIComponent(tag), function (data) {
					if ( data.result === 'ok' ) {
						callback({
							name:data.tag.name,
							id:data.tag._id,
							storyCount:data.storyCount
						});
					} else {
						callback();
					}
				});
			},

			initialize: function() {
			},

			afterRender: function() {
				var self = this;

				// Set validation
				$(this.el).find('.tell-your-story_form').validate({
					 errorPlacement: function(error, element) {
						if ( element.hasClass('input-email') && ! self.facebookId ) {
							element.removeClass('valid');
							element.closest('.input-email-wrapper').removeClass('valid');
							element.closest('.input-email-wrapper').addClass('error');
						}
						if ( element.hasClass('input-name') && ! self.facebookId ) {
							element.removeClass('valid');
							element.closest('.input-name-wrapper').removeClass('valid');
							element.closest('.input-name-wrapper').addClass('error');
						}
						self.checkForm();
					},
					success: function (label, element) {
						if ( $(element).hasClass('input-email') && ! self.facebookId ) {
							$(element).closest('.input-email-wrapper').removeClass('error').addClass('valid');
						}
						if ( $(element).hasClass('input-name') && ! self.facebookId ) {
							$(element).closest('.input-name-wrapper').removeClass('error').addClass('valid');
						}
						self.checkForm();
					}
				});

				//Enable file upload
				$('#addPicture').unsigned_cloudinary_upload('userstory', 
					{
						cloud_name: 'diin',
						callback: 'http://taligestilling.herokuapp.com/cloudinary_cors.html'
					}, 
					{ multiple: false, callback: 'http://taligestilling.herokuapp.com/cloudinary_cors.html' }
				).bind('cloudinarydone', function(e, data) {
					console.log('hello hello');
					self.imageUpload=null;
					self.youtubeId=null;

					self.imageUpload = data.result;
					console.log(self.imageUpload);
					$(self.el).find('.add-picture .status').text('');
					$(self.el).find('.add-picture').removeClass('uploading');
					
					$(self.el).find('.story-image img').remove();
					$(self.el).find('.story-image').addClass('has-image').append($.cloudinary.image(data.result.public_id, { width: 453 }));
				}).bind('cloudinaryprogress', function(e, data) {
					console.log('22222');
					$(self.el).find('.add-picture').addClass('uploading').find('.status').text(Math.round((data.loaded * 100.0) / data.total) + '%');
				});
			},

			serialize: function() {
				return {
					tags:this.collection.toJSON()
				};
			}
		});

		return View;
	});