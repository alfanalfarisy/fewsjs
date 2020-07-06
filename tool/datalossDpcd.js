var moment = require('moment')
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dpcdMainSchema = new Schema({
	site: Number,
	dt: Date,
	lx: [Number,Number],
	t: [Number,Number],
	skb: [Number,Number],
	edb: [Number,Number],
	wps: [Number,Number],
	inps: [Number,Number],
	vpr: [Number,Number],
	vbr: [Number,Number],
	vrl: [Number,Number],
	ipr: [Number,Number],
	ibr: [Number,Number],
	irl: [Number,Number],
},
{
    timestamps: true
});
var connection = mongoose.createConnection('mongodb://projek20:projek20@localhost/siagabanjir?repl=rs0',{useNewUrlParser: true,useUnifiedTopology: true});

var Dpcd = connection.model('DpcdMain', dpcdMainSchema,'main_dpcd');

// MongoDB Config
// var connection = mongoose.createConnection('mongodb://projek20:projek20@198.211.106.64:27017/siagabanjir',{useNewUrlParser: true,useUnifiedTopology: true});


Dpcd.find({'dt':{$gt:new Date('2020-07-05 12:00:00'),$lte: new Date('2020-07-05 21:00:00')}}).lean().exec((err,resp)=>{
		var sum=0;
	resp.forEach(data=>{
	// console.log(data.createdAt)
		receive= new Date(moment(data.createdAt).add(7,'hours')).getTime()
		transmit = new Date(data.dt).getTime()
		selisih = receive-transmit
		sum+=selisih
		
	})

		console.log('Jumlah selisih seluruh data pengamatan catu daya : ',sum/1000)
		console.log('Jumlah data pengamatan',resp.length)
		console.log('Rata-rata selisih waktu pengamatan',sum/resp.length/1000)
})
Dpcd.find({'dt':{$gt:new Date('2020-07-04 11:00:00'),$lte: new Date('2020-07-04 14:30:00')}}).lean().exec((err,resp)=>{
	// console.log(resp.length)
})