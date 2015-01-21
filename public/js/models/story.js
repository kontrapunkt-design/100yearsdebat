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
			$.get('http://graph.facebook.com/?id=http://taligestilling.herokuapp.com/story/'+this.get('_id'), function(data) {
				self.set('commentCount',data.comments || 0);
				self.set('shareCount',data.shares > 0 ? Number(Number(data.shares)-Number(data.comments)) : 0);
				self.trigger('fetched:socialCount');
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