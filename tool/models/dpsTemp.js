var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var MongooseTrigger = require('mongoose-trigger');

var DpsTempSchema = new Schema({
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

var DpsTemp = mongoose.model('DpsTemp', DpsTempSchema, 'temp_dps');

module.exports = DpsTemp;

