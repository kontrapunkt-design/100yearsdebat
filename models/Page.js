var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Page Model
 * ==========
 */

var Page = new keystone.List('Page', {
	defaultSort:'key',
	autokey: { from: 'key', path: 'key', unique: true }
});

Page.add({
	key: { type: String, required: true, initial:true, index:true },
	title: { type: String, required: false },
	subtitle: { type: String, required: false },
	text: { type: Types.Html, wysiwyg: true, height: 150, initial: true},
	image: { type: Types.CloudinaryImage, label: 'Image', note: 'JPG, PNG, GIF, BMP, ICO, TIFF or PDF'}
});

Page.defaultColumns = 'key, title, subtitle, text';
Page.register();
