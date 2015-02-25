define([
  "backbone",
  "deepmodel"
],

function(Backbone,app) {
	var Model = Backbone.DeepModel.extend({
		urlRoot: "",

		idAttribute: "key"
	});

	return Model;
});