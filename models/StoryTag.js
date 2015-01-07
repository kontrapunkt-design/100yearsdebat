var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * StoryTag Model
 * ==================
 */

var StoryTag = new keystone.List('StoryTag', {
	autokey: { from: 'name', path: 'key', unique: true }
});

StoryTag.add({
	name: { type: String, required: true },
	showAsDefault: { type: Boolean, required: false, default: false, initial: true}
});

StoryTag.relationship({ ref: 'Story', path: 'tags' });

StoryTag.register();
