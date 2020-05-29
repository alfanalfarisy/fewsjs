var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var MongooseTrigger = require('mongoose-trigger');

var DpsMainTesSchema = new Schema({
	dt: Date,
	site: [Number],
	tma: [Number,Number],
	vair: [Number,Number],
	ch: [Number,Number]

	},
	{
		timestamps: true
	});

var DpsMainTes = mongoose.model('DpsMainTes', DpsMainTesSchema, 'dpsMainTes');

module.exports = DpsMainTes;

