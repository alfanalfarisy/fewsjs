var moment = require('moment')
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema config
var dpsMainSchema = new Schema({
	dt: Date,
	site: [Number],
	tma: [Number,Number],
	vair: [Number,Number],
	ch: [Number,Number]

	},
	{
		timestamps: true
});
var usersSchema = new Schema({});
var subsSchema = new Schema({});

// MongoDB Config
// var connection = mongoose.createConnection('mongodb://projek20:projek20@198.211.106.64:27017/siagabanjir',{useNewUrlParser: true,useUnifiedTopology: true});
var connection = mongoose.createConnection('mongodb://projek20:projek20@localhost/siagabanjir?replicaSet=rs0',{useNewUrlParser: true,useUnifiedTopology: true});
var TempDps = connection.model('DpsMain', dpsMainSchema,'temp_dps');

TempDps.find({'dt':{$gt:new Date('2020-07-04 12:00:00'),$lte: new Date('2020-07-04 14:30:00')}}).lean().exec((err,resp)=>{
		var sum=0;
	resp.forEach(data=>{
	// console.log(data.createdAt)
		receive= new Date(moment(data.createdAt).add(7,'hours')).getTime()
		transmit = new Date(data.dt).getTime()
		selisih = receive-transmit
		
		sum+=selisih
		
	})

		console.log('Jumlah selisih seluruh data pengamatan sungai: ',sum/1000)
		console.log('Jumlah data pengamatan',resp.length)
		console.log('Rata-rata selisih waktu pengamatan',sum/resp.length/1000)
})
TempDps.find({'dt':{$gt:new Date('2020-07-04 11:00:00'),$lte: new Date('2020-07-04 14:30:00')}}).lean().exec((err,resp)=>{
	// console.log(resp.length)
})