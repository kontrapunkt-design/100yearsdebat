define([
  "backbone",
  "models/story",
  "app"
],

function(Backbone, Story, app) {
	var Collection = Backbone.Collection.extend({
		model: Story,

		url: function () {
			var url="/api/stories/";

			if ( this.tagIdFilter ) {
				url = "/api/stories/tag/"+this.tagIdFilter;
			}

			return url;
		},
		
		idAttribute: "_id"
	});

	return Collection;
});