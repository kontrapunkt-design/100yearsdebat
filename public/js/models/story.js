define([
  "backbone",
  "deepmodel"
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
			$.get('https://graph.facebook.com/v2.1/?fields=share{comment_count}&id=http://taligestilling.herokuapp.com/story/'+this.get('_id'), function(data) {
				self.set('commentCount',data.share.comment_count);
				self.trigger('fetched:commentCount');
			});
		},

		defaults: {
			fbCount: null
		},

		idAttribute: "_id"
	});

	return Model;
});