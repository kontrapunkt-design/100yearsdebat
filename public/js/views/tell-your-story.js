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

			tags: null,

			events: {
				'submit .tell-your-story_form':'form_submitHandler',
				'submit .tell-your-story_form--tags': 'customTags_submit',
				'click .close-btn':'this_closeHandler',
				'click .tell-your-story--tags a': 'tag_clickHandler',
				'click a.add-picture': 'addPicture_clickHandler',
				'click a.add-video': 'addVideo_clickHandler',
				'click .story-image .remove-btn': 'storyImageRemoveBtn_clickHandler'
			},

			storyImageRemoveBtn_clickHandler: function (e) {
				console.log('yoo');
				e.preventDefault();
				this.imageUpload=null;
				$(this.el).find('.story-image').removeClass('has-image').find('img').remove();
			},

			this_closeHandler: function (e) {
				e.preventDefault();
				app.trigger('modal:close');
			},

			addPicture_clickHandler: function (e) {
				e.preventDefault();
				$('#add-picture').click();
			},

			addVideo_clickHandler: function (e) {
				e.preventDefault();
			},

			form_submitHandler: function (e) {
				var self = this;
				e.preventDefault();

				self.tags = [];

				$(this.el).find('.tell-your-story--tags a.selected').each(function (i, tagItem) {
					console.log(tagItem);
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

				$.ajax({
					url: window.location.origin + '/api/stories',
					type: 'POST',
					data: {
						story:$(this.el).find('.input-story').val(),
						email:$(this.el).find('.input-email').val(),
						tags:self.tags,
						image:this.imageUpload
					},
					success: function (data) {
						console.log('submitted!');
						console.log(data);
					}
				})
			},

			tag_clickHandler: function (e) {
				e.preventDefault();
				$(e.currentTarget).toggleClass('selected');
			},

			customTags_submit: function (e) {
				var self = this;

				e.preventDefault();
				var newTagVal = $(this.el).find('.custom-tag').val();

				if ( newTagVal.length > 0 && $(self.el).find('.tell-your-story--tags a[data-name="'+newTagVal+'"]').length ==0 ) {
					self.checkForTag(newTagVal, function (tag) {
						if ( tag ) {
							$(self.el).find('.tell-your-story--tags').append('<a data-id="'+tag.id+'" data-name="'+tag.name+'" class="selected">#'+tag.name+' ('+tag.storyCount+')</a>');
						} else {
							$(self.el).find('.tell-your-story--tags').append('<a data-name="'+newTagVal+'" class="selected">#'+newTagVal+' (0)</a>');
						}
					});

					console.log(newTagVal);
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

				//Enable file upload
				$('#addPicture').unsigned_cloudinary_upload('userstory', 
					{
						cloud_name: 'diin',
						callback: window.location.origin + '/cloudinary_cors.html'
					}, 
					{ multiple: false, callback: window.location.origin + '/cloudinary_cors.html' }
				).bind('cloudinarydone', function(e, data) {
					self.imageUpload = data.result;
					console.log(self.imageUpload);
					$(self.el).find('.add-picture').text('');
					$(self.el).find('.add-picture').removeClass('uploading');
					
					$(self.el).find('.story-image').addClass('has-image').append('<img src="'+data.result.url+'" width="100%"/>');
				}).bind('cloudinaryprogress', function(e, data) {
					$(self.el).find('.add-picture').addClass('uploading').text(Math.round((data.loaded * 100.0) / data.total) + '%');
				});

				// Set validation
				$(this.el).find('.tell-your-story_form').validate({
					errorPlacement: function(error, element) {}
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