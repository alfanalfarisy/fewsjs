var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment-timezone').tz.setDefault("Asia/Jakarta");


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
var floodRecordSchema = new Schema({
	dt: Date,
	site: [Number],
	tma: [Number],
	vair: [Number],
	ch: [Number],
	kondisi : String,
	status : String
	},
	{
		timestamps: true
	});

//MongoDB Config
var connection = mongoose.createConnection('mongodb://localhost/siagabanjir?replicaSet=rs0',{useNewUrlParser: true,useUnifiedTopology: true});
var DpsMain = connection.model('DpsMain', dpsMainSchema,'main_dps_tes');
var floodRecord = connection.model('floodRecord', floodRecordSchema,'flood-rec');

var socket = require('socket.io-client')('http://localhost:3000');
const site=[221,222,223]

function decisionOn(){

	var start = moment().format();
	var end = moment().subtract(60, 'minutes').format(); 	

    Promise.all([
    	DpsMain.findOne({'site':221}).sort({'dt':-1}).lean(),
    	DpsMain.findOne({'site':222}).sort({'dt':-1}).lean(),
    	DpsMain.findOne({'site':223}).sort({'dt':-1}).lean(),
    	DpsMain.find({'site':221}).sort({'dt':-1}).limit(6).lean(),
    	DpsMain.find({'site':222}).sort({'dt':-1}).limit(6).lean(),
    	DpsMain.find({'site':223}).sort({'dt':-1}).limit(6).lean()

    	]).then((result)=>{
    		[ktlm1,dpk1,mgr1,ktlm6,dpk6,mgr6]=result;
    		tmaKtlm=ktlm1.tma[0]
    		tmaDpk=dpk1.tma[0]
    		tmaMgr=mgr1.tma[0]

    		ichKtlm = ktlm6[0].ch[0] - ktlm6[ktlm6.length-1].ch[0]
    		ichDpk = dpk6[0].ch[0] - dpk6[dpk6.length-1].ch[0]
    		ichMgr = mgr6[0].ch[0] - mgr6[mgr6.length-1].ch[0]

    		data=[{
    			'site' : 221,
    			'tma' : tmaKtlm,
    			'ich' : ichKtlm
    		},{'site' : 222, 
    			'tma': tmaDpk,
    			'ich' : ichDpk
    		},{'site' : 223, 
    			'tma': tmaMgr,
    			'ich' : ichMgr}]

    		data.forEach((data)=>{
				
				var decisionTma = (tma,siaga1,siaga2,siaga3)=>{
				        return tma>siaga1 ? 4 : //siaga1 
				        tma>siaga2&&tma<=siaga1 ? 3 : //siaga2
				        tma>siaga3&&tma<=siaga2 ? 2 : //siaga3
				        tma>0&&tma<=siaga3 ? 1 : //siaga4
				        0 //Error
				}

				var st = data.site
				var ich = data.ich
				var tma = data.tma
				var statusTma;
				var statusIch;

				statusTma = (st,tma)=>{
					return st==221 ? decisionTma(tma,300,200,80):
					st==222 ? decisionTma(tma,200,150,80):
					decisionTma(tma,200,150,80)
				}
				statusIch =(st)=>{
					return ich<0 ? 0 : //Error
					ich==0 ? 1 : //  Tidak Hujan
					ich>0&&ich<=5 ? 2 : // Hujan Ringan
					ich>5&&ich<=10 ? 3 : // Hujan Sedang
					ich>10&&ich<=20 ? 4 : // Hujan Lebat
					5 // Hujan Sangat Lebat
				}
				console.log('Decision site', st)
				statusTma = statusTma(st,tma)
				console.log('Nilai TMA', tma)
				console.log('Bobot status TMA', statusTma)
				statusIch = statusIch(st)
				console.log('Nilai ICH', ich)
				console.log('Bobot status Internsitas Curah Hujan', statusIch)
				if(statusIch>=4||statusTma>1){
					data={
						'pos' : st,
						'ich' : ich,
						'tma' : tma,
						'status' : statusTma,
						'kondisi' : statusIch,
						'dt' : new Date(),
					}
					console.log('Diseminasi running')
					console.log('')
					socket.emit('floodDecision',{data})
				}else{
					console.log('Diseminasi not running')
					console.log('')
				}    			
    		})
			
    })
}

socket.on('decisionOn',()=>{
	decisionOn()	
})

// data={
// 	'st' : '221',
// 	'ich' : '22',
// 	'tma' : '24',
// 	'status' : 'siaga3',
// 	'kondisi' : 'hujan lebat',
// 	'dt' : new Date(),
// }
// console.log(data)
// socket.emit('floodDecision',{data})

// var dataToMongo = new floodRecord({ 
//   dt: data.dt,
//   site: data.st,
//   tma: data.tma,
//   ich: data.ich,
//   vair: data.vair,
//   kondisi: data.kondisi,
//   status: data.status
// });
// dataToMongo.save(function (err) {
//   if (err) return handleError(err);
//   console.log("success")

// });

			
