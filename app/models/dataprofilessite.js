var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var MongooseTrigger = require('mongoose-trigger');
``
var DataProfilesSiteSchema = new Schema({
  site: Number,
  pos: String,
  lat: String,
  long: String,
},
{
    timestamps: true
});

var DataProfilesSite = mongoose.model('DataProfilesSite', DataProfilesSiteSchema, 'mtdt_st');

module.exports = DataProfilesSite;