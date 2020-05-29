var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FloodRecordSchema = new Schema({});

var FloodRecord = mongoose.model('FloodRecord', FloodRecordSchema, 'flood_rec');

module.exports = FloodRecord;
