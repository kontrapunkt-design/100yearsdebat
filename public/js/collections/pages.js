define([
  "backbone",
  "models/page",
  "app"
],

function(Backbone, Page, app) {
	var Collection = Backbone.Collection.extend({
		model: Page,
		
		idAttribute: "key"
	});

	return Collection;
});