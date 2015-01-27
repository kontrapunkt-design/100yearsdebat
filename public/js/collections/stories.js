define([
  'backbone',
  'models/story',
  'app'
],

function(Backbone, Story, app) {
	var Collection = Backbone.Collection.extend({
		model: Story,

		sortVar1: 'order',
		sortVar2: 'submitDate',

		pagination: 0,


		comparator: function( item ){
			var self = this;
			return[item.get( self.sortVar1 ), item.get( self.sortVar2 )];
		},

		setTagIdFilter: function (tagId) {
			this.trigger('filter:change');
			this.pagination=0;
			this.tagIdFilter=tagId;
		},

		url: function () {
			var url='/api/stories?page='+this.pagination;

			if ( this.tagIdFilter ) {
				url = '/api/stories/tag/'+this.tagIdFilter+'?page='+this.pagination;
			}

			return url;
		},

		fetchMore: function () {
			this.pagination++;
			this.fetch({remove:false});
		},

		idAttribute: '_id'
	});

	return Collection;
});