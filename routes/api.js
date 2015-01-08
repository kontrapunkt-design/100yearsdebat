module.exports = function(app, keystone) {
	var Story = keystone.list('Story');

	app.post('/api/story', function(req, res) {
		console.log('API/STORY CALLED');
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
	});
};