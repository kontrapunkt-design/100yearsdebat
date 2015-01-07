module.exports = function(app, keystone) {
	var Story = keystone.list('Story');

	app.get('/api/story', function(req, res) {
		var data = req.body;
		var tags = [];

		var story = new Story.model({
			state:'submitted',
			tags: tags,
			content: {
				description: data.story
			},
			email:data.email,
			facebookId:data.facebookId,
			author:data.author
		});

		story.save(function (newStory) {
			res.json({
				result:'ok',
				story: newStory
			});
		});
	});
};