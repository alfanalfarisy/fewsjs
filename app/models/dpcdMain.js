var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DpcdMainSchema = new Schema({});

var DpcdMain = mongoose.model('DpcdMain', DpcdMainSchema, 'main_dpcd');

module.exports = DpcdMain;

