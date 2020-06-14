var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var MongooseTrigger = require('mongoose-trigger');

var DpsMainSchema = new Schema({
	dt: Date,
	site: [Number],
	tma: [Number,Number],
	vair: [Number,Number],
	ch: [Number,Number]

	},
	{
		timestamps: true
	});

var DpsMain = mongoose.model('DpsMain', DpsMainSchema, 'main_dps_tes');

module.exports = DpsMain;

