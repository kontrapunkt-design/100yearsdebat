var keystone = require('keystone')
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	locals.data = {
		tags: []
	};

	// Load all categories
	view.on('init', function(next) {
		
		keystone.list('StoryTag').model.find().sort('name').exec(function(err, results) {
			
			if (err || !results.length) {
				return next(err);
			}
			
			// locals.data.categories = results;

			// var categories = [];
			
			// Load the counts for each category
			async.each(results, function(tag, next) {

				keystone.list('Story').model.count().where('tags').in([tag.id]).exec(function(err, count) {
					tag.assetCount = count;
					var newTag = {
						'_id':tag._id,
						'key':tag.key,
						'name':tag.name,
						'storyCount':count
					};
					locals.data.tags.push(newTag);
					next(err);
				});
				
			}, function(err) {
				next(err);
			});
			
		});
		
	});
	
	// Render the view
	view.render('index');
	
};
