define([
  "backbone",
  "models/tag",
  "app"
],

function(Backbone, Tag, app) {
	var Collection = Backbone.Collection.extend({
		model: Tag,

		url: "/api/tags/",
		
		idAttribute: "_id"
	});

	return Collection;
});