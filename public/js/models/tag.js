define([
  "backbone",
  "deepmodel"
],

function(Backbone,app) {
	var Model = Backbone.DeepModel.extend({
		urlRoot: "",

		idAttribute: "_id"
	});

	return Model;
});