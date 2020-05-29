var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var MongooseTrigger = require('mongoose-trigger');

var DpsMainSchema = new Schema({
//   Tanggal: String,
//   Waktu: String,
//   stasiun: String,
//   tma: String,
//   debit: String,
//   ch: String,
//   status:{
//   	tma : String,
//   	debit : String,
//   	ch : String
//   }
// },
// {
//     timestamps: true
}
);

var DpsMain = mongoose.model('DpsMain', DpsMainSchema, 'main_dps');

module.exports = DpsMain;

