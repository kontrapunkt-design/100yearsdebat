var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Story Model
 * ==========
 */

var Story = new keystone.List('Story', {
	defaultSort:'order'
});

Story.add({
	//Hidden
	submitDate: {type: Types.Datetime, default: Date.now, hidden: true},

	type: {type: Types.Select, options: 'story, poll', required: true, default:'story', initial:true},

	title: { type: String, required: false },

	//Poll stuff
	answer1: {type: String, required:false, dependsOn:{'type':'poll'}},
	answer1Votes: {type: Number, required:false, hidden:false, default:0},
	answer2: {type: String, required:false, dependsOn:{'type':'poll'}},
	answer2Votes: {type: Number, required:false, hidden:false, default:0},
	answer3: {type: String, required:false, dependsOn:{'type':'poll'}},
	answer3Votes: {type: Number, required:false, hidden:false, default:0},
	answer4: {type: String, required:false, dependsOn:{'type':'poll'}},
	answer4Votes: {type: Number, required:false, hidden:false, default:0},

	//Story stuff
	subtitle: { type: String, required: false, dependsOn: {'type':'story'}},
	story: { type: Types.Html, wysiwyg: false, height: 150, initial: true, index:true, dependsOn: {'type':'story'}},
	image: { type: Types.CloudinaryImage, label: 'Image', note: 'JPG, PNG, GIF, BMP, ICO, TIFF or PDF', dependsOn: {'type':'story'}},
	tags: { type: Types.Relationship, ref: 'StoryTag', many: true },

	frontpageStory: { type:Boolean, required:false, default:false , dependsOn: {'type':'story'}},
	frontpageImage: {type: Types.CloudinaryImage, required:false, note: 'Big wide image for frontpage story', dependsOn:{'frontpageStory':true}, dependsOn: {'type':'story'}},

	
	youtube: { type: String , dependsOn: {'type':'story'}},
	

	// author: { type: String, required: false , dependsOn: {'type':'story'}},
	email: { type: String, required: false, index: true, note: 'Gets filled out when a user submits a story with his/her email.', noedit:true , dependsOn: {'type':'story'}},
	facebookName: { type: String, required: false, index: true, note: 'Gets filled out when a user submits a story with Facebook.', noedit:true, dependsOn: {'type':'story'}},
	facebookId: { type: String, note: 'Gets filled out when a user submits a story with Facebook.', hidden:false , dependsOn: {'type':'story'}},


	//Grid stuff
	order: { type: Types.Select, default:'Not ordered', options: 'Not ordered, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18', required: false, note: 'Sets the order in which the story should be shown on the front page - be aware not to have stories with the same "order".'},
	featureStory: {type:Types.Boolean, required:false, default: false, note: 'Expand the story to 2 colums.'},
	state: { type: Types.Select, options: 'submitted, published, archived', default: 'published', index: true, note: 'Only "published" stories will be visible in the grid.'},
});

Story.defaultColumns = 'order|9%, story|30%, tags, state|10%';
Story.register();
