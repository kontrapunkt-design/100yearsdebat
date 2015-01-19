define([
  "backbone",
  "models/story",
  "app"
],

function(Backbone, Story, app) {
	var Collection = Backbone.Collection.extend({
		model: Story,

		sortVar1: 'order',
		sortVar2: 'submitDate',

		comparator: function( item ){
			var self = this;
			return[item.get( self.sortVar1 ), item.get( self.sortVar2 )];
		},

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