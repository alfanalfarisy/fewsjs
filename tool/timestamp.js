var moment = require('moment')
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema config
var dpsMainSchema = new Schema({
	dt: String,

	},
	{
		timestamps: true
});
var usersSchema = new Schema({});
var subsSchema = new Schema({});

//MongoDB Config
// var connection = mongoose.createConnection('mongodb://projek20:projek20@198.211.106.64:27017/siagabanjir',{useNewUrlParser: true,useUnifiedTopology: true});
var connection = mongoose.createConnection('mongodb://projek20:projek20@localhost/siagabanjir?replicaSet=rs0',{useNewUrlParser: true,useUnifiedTopology: true});
var TempDps = connection.model('DpsMain', dpsMainSchema,'tes');

var dataToMongo = new TempDps({ 
	  // dt: data.dt,
	  dt: 'tes timestamps',
	});
		dataToMongo.save(function (err) {
			TempDps.find({},(err,resp)=>{
				console.log(resp)
			})
		});