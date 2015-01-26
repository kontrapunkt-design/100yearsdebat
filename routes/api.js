module.exports = function(app, keystone) {
	var async = require('async');
	var Story = keystone.list('Story');
	var StoryTag = keystone.list('StoryTag');

	var saveStory = function (argument) {
		
	};

	app.post('/api/stories', function(req, res) {
		var data = req.body;
		var postedTags = data.tags;
		var tags = [];


		//Populate tags
		async.each(postedTags || [], function (postedTag, next) {
			if ( postedTag.id ) {
				tags.push(postedTag.id);
				next();
			} else {
				var newTag = new StoryTag.model({
					name:postedTag.name,
					showAsDefault:false
				});
				newTag.save(function (err, savedTag) {
					if ( ! err ) {
						tags.push(savedTag._id);
						next(err);
					} else {
						next(err);
					}
				});
			}
		}, function(err) {
			if ( ! err ) {
				var story = new Story.model({
					state:'submitted',
					tags: tags,
					story: data.story,
					email:data.email,
					image:data.image,
					facebookId:data.facebookId,
					facebookName:data.facebookName,
					youtube:data.youtube,
					image:data.image,
					author:data.author
				});

				story.save(function (err, savedStory) {
					if ( ! err ) {
						res.json({
							result:'ok',
							story: savedStory
						});
					} else {
						res.json( {
							result:'error',
							error:err
						});
					}
				});
			}
		});
	});

	app.get('/api/stories', function (req, res) {
		Story.model.find({state:'published'}).sort('order submitDate').limit(10).exec(function(err, stories) {
			if ( ! err ) {
				res.json(stories);
			} else {
				res.json({
					result:'error',
					error:err
				});
			}
		});
	});

	app.get('/api/stories/:storyId', function (req, res) {
		Story.model.findOne({_id:req.params.storyId}).exec(function(err, story) {
			if ( ! err ) {
				res.json(story);
			} else {
				res.json({
					result:'error',
					error:err
				});
			}
		});
	});
	
	app.get('/api/stories/tag/:tagId', function (req, res) {
		Story.model.find({state:'published', tags:req.params.tagId}).limit(10).exec(function(err, story) {
			if ( ! err ) {
				res.json(story);
			} else {
				res.json({
					result:'error',
					error:err
				});
			}
		});
	});

	app.get('/api/tags/search/:tagName', function(req, res) {
		var tagName = decodeURIComponent(req.params.tagName);
		StoryTag.model.findOne({name:tagName}).exec(function(err, tag) {
			if ( ! err && tag ) {
				if ( tag ) {
					console.log('tag');
					console.log(tag);

					Story.model.count().where('tags').in([tag._id]).exec(function(err2, count) {
						if ( ! err2 ) {
							res.json({
								result:'ok',
								tag: tag,
								storyCount:count
							});
						} else {
							res.json({
								result:'error',
								error:err2
							})
						}
					});

				} else {
					res.json({
						result:'notFound'
					});
				}
			} else {
				res.json({
					result:'err',
					err:err
				});
			}
		});
	});
};