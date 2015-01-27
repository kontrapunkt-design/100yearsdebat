define([
  "backbone",
  "deepmodel",
  "jquery.cookie"
],

function(Backbone,app) {
	var Model = Backbone.DeepModel.extend({
		urlRoot: "/api/stories/",

		initialize: function () {
			console.log('swag swag');

			//Fetch comment count from facebook
			this.getShareCount();
		},

		getShareCount: function () {
			var self = this;
			$.get('http://graph.facebook.com/?id=http://taligestilling.herokuapp.com/story/'+this.get('_id'), function(data) {
				self.set('commentCount',data.comments || 0);
				self.set('shareCount',data.shares > 0 ? Number(Number(data.shares)-Number(data.comments)) : 0);
				self.trigger('fetched:socialCount');
			});
		},

		pollVote: function (answerId) {
			var self = this;
			$.post('/api/stories/'+this.get('_id')+'/poll',
				{
					answerId: answerId
				}
			).done(function (data) {
				console.log('Story model:: Vote submitted.');
				if ( data.result === 'ok' ) {
					$.cookie('pollVote'+self.get('_id'), answerId, { expires: 99999, path: '/' });
					var vote = Number(self.get('answer'+answerId+'Votes')) || 0;
					self.set('answer'+answerId+'Votes', vote+1);
					self.trigger('pollChange');
				}
			}).fail(function (data) {
				console.log('Story model:: Error trying to post vote.');
			});
		},

		defaults: {
			commentCount: 0,
			shareCount: 0
		},

		idAttribute: "_id"
	});

	return Model;
});