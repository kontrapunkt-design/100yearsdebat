define([
  "backbone",
  "deepmodel"
],

function(Backbone,app) {
	var Model = Backbone.DeepModel.extend({
		urlRoot: "/api/stories/",

		idAttribute: "_id"
	});

	return Model;
});