var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Story Model
 * ==========
 */

var Story = new keystone.List('Story', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

Story.add({
	title: { type: String, required: false },
	state: { type: Types.Select, options: 'submitted, draft, published, archived', default: 'published', index: true, hidden: true},
	// publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	publishedDate: {type: Types.Datetime, default: Date.now, hidden: true},
	image: { type: Types.CloudinaryImage, label: 'Image', note: 'JPG, PNG, GIF, BMP, ICO, TIFF or PDF'},
	// youtube: { type: String },
	content: {
		description: { type: Types.Html, wysiwyg: false, height: 150 },
	},
	tags: { type: Types.Relationship, ref: 'StoryTag', many: true },
	author: { type: String, required: false, index: true },
	email: { type: String, required: false, index: true },
	facebookId: { type: String },
});

Story.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});

Story.defaultColumns = 'title, content, author|20%, publishedDate|20%';
Story.register();
