var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Story Model
 * ==========
 */

var Story = new keystone.List('Story', {
	autokey: { path: 'slug', from: 'story', unique: true }
});

Story.add({
	story: { type: Types.Html, wysiwyg: false, height: 150, initial: true, index:true},
	title: { type: String, required: false },
	state: { type: Types.Select, options: ', archived, submitted, draft, published', default: 'published', index: true},
	// publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	submitDate: {type: Types.Datetime, default: Date.now, hidden: true},
	image: { type: Types.CloudinaryImage, label: 'Image', note: 'JPG, PNG, GIF, BMP, ICO, TIFF or PDF'},
	// youtube: { type: String },
	tags: { type: Types.Relationship, ref: 'StoryTag', many: true },
	email: { type: String, required: false, index: true },
	facebookName: { type: String, required: false, index: true },
	facebookId: { type: String }
});

Story.defaultColumns = 'story, tags, state, submitDate|20%';
Story.register();
