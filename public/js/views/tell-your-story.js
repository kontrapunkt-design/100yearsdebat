define([
		// Libraries.
		"jquery",
		"backbone",
		"handlebars",
		"app",

		// Plugins.
		"cloudinary",
		"plugins/backbone.layoutmanager"
	],
	function($, Backbone, Handlebars, app) {
		var View = Backbone.LayoutView.extend({

			template: "tell-your-story",

			className: "tell-your-story--view",

			tagName: 'section',

			imageUpload: null,

			events: {
				// 'submit form':'form_submitHandler'
			},

			form_submitHandler: function (e) {
				e.preventDefault();

				// $.ajax({
				// 	url: window.location.origin + '/api/story',
				// 	type: 'POST',
				// 	data: {
				// 		story:$(this.el).find('textarea').val(),
				// 		email:$(this.el).find('.email').val()
				// 	}
				// })
	//     		console.log('submit');
				// $(this.el).find('form').fileupload({
				// 	url: window.location.origin + '/api/story',
				// 	dataType: 'json',
				// 	formData: {
				// 		story:$(this.el).find('textarea').val(),
				// 		email:$(this.el).find('.email').val()
				// 	},
				// 	done: function (e, data) {
				// 		console.log('DONE event');
				// 	},
				// 	progressall: function (e, data) {
				// 		console.log('123');
				// 		console.log(progress);
				// 		var progress = parseInt(data.loaded / data.total * 100, 10);
				// 	}
				// });
			},

			initialize: function() {
				$.cloudinary.config({ cloud_name: 'diin', api_key: '967225847829495'});
			},

			afterRender: function() {
				var self = this;

				//Enable file upload
				$('.add-picture').unsigned_cloudinary_upload('userstory', 
					{
						cloud_name: 'diin',
						callback: 'http://taligestilling.herokuapp.com/cloudinary_cors.html'
					}, 
					{ multiple: false, callback: 'http://taligestilling.herokuapp.com/cloudinary_cors.html' }
				).bind('cloudinarydone', function(e, data) {
					self.imageUpload = data.result;
					console.log(self.imageUpload);
				}).bind('cloudinaryprogress', function(e, data) {
					console.log(Math.round((data.loaded * 100.0) / data.total) + '%'); 
				});
			},

			serialize: function() {
				return {
				};
			}
		});

		return View;
	});