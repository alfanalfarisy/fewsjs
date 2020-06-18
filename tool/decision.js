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
var connection = mongoose.createConnection('mongodb://projek20:projek20@localhost/siagabanjir?replicaSet=rs0',{useNewUrlParser: true,useUnifiedTopology: true});
var DpsMain = connection.model('DpsMain', dpsMainSchema,'main_dps');
var floodRecord = connection.model('floodRecord', floodRecordSchema,'flood_rec');

var socket = require('socket.io-client')('http://localhost:3000');
const site=[331]

function decisionOn(){

	var start = moment().format();
	var end = moment().subtract(60, 'minutes').format(); 	

    Promise.all([
    	// DpsMain.findOne({'site':221}).sort({'dt':-1}).lean(),
    	// DpsMain.findOne({'site':222}).sort({'dt':-1}).lean(),
    	// DpsMain.findOne({'site':223}).sort({'dt':-1}).lean(),
    	DpsMain.findOne({'site':331}).sort({'dt':-1}).lean(),
    	// DpsMain.find({'site':221}).sort({'dt':-1}).limit(6).lean(),
    	// DpsMain.find({'site':222}).sort({'dt':-1}).limit(6).lean(),
    	// DpsMain.find({'site':223}).sort({'dt':-1}).limit(6).lean()
    	DpsMain.find({'site':331}).sort({'dt':-1}).limit(6).lean()

    	]).then((result)=>{
    		// [ktlm1,dpk1,mgr1,kdgpt1,ktlm6,dpk6,mgr6,kdgpt6]=result;
    		[kdgpt1,kdgpt6]=result;
    		// console.log(result)
    		// tmaKtlm=ktlm1.tma[0]
    		// tmaDpk=dpk1.tma[0]
    		// tmaMgr=mgr1.tma[0]
    		tmaKdgpt=kdgpt1.tma[0]

    		// ichKtlm = ktlm6[0].ch[0] -ktlm6[ktlm6.length-1].ch[0]
    		// ichDpk = dpk6[0].ch[0] - dpk6[dpk6.length-1].ch[0]
    		// ichMgr = mgr6[0].ch[0] - mgr6[mgr6.length-1].ch[0]
    		ichKdgpt = Kdgpt6[0].ch[0] - Kdgpt6[Kdgpt6.length-1].ch[0]

    		data=[{
    			// 'site' : 331,
    			// 'tma' : tmaKtlm,
    			// 'ich' : ichKtlm
    		// },{'site' : 222, 
    		// 	'tma': tmaDpk,
    		// 	'ich' : ichDpk
    		// },{'site' : 223, 
    		// 	'tma': tmaMgr,
    		// 	'ich' : ichMgr
    		// },{
    			'site' : 331, 
    			'tma': tmaKdgpt,
    			'ich' : ichKdgpt
    		}]

    		data.forEach((data)=>{
				
				var decisionTma = (tma,siaga1,siaga2,siaga3)=>{
				        return tma>siaga1 ? [4,'Siaga 1'] : //siaga1 
				        tma>siaga2&&tma<=siaga1 ? [3,'Siaga 2'] : //siaga2
				        tma>siaga3&&tma<=siaga2 ? [2,'Siaga 3'] : //siaga3
				        tma>0&&tma<=siaga3 ? [1,'Siaga 4'] : //siaga4
				        [0,'Error']
				}

				var st = data.site
				var ich = data.ich
				var tma = data.tma
				var statusTma;
				var statusIch;

				statusTma = (st,tma)=>{
					return st==221 ? decisionTma(tma,300,200,80):
					st==222 ? decisionTma(tma,200,150,80):
					st==331 ? decisionTma(tma,300,200,80):
					decisionTma(tma,200,150,80)
				}
				statusIch =(st)=>{
					return ich<0 ? [0,'Error'] : //Error
					ich==0 ? [1,'Tidak Hujan'] : //  Tidak Hujan
					ich>0&&ich<=5 ? [2,'Hujan Ringan'] : // Hujan Ringan
					ich>5&&ich<=10 ? [3,'Hujan Sedang'] : // Hujan Sedang
					ich>10&&ich<=20 ? [4,'Hujan Lebat'] : // Hujan Lebat
					[5,'Hujan Sangat Lebat'] // Hujan Sangat Lebat
				}
				console.log('Decision site : ', st)
				statusTma = statusTma(st,tma)
				console.log('Nilai TMA : ', tma)
				console.log('Kondisi TMA : ', statusTma[1])
				statusIch = statusIch(st)
				console.log('Nilai intensitas curah hujan 1 jam terakhir: ', ich)
				console.log('Kondisi cuaca : ', statusIch[1])
				if(statusIch[0]>=4||statusTma[0]>1){
					data={
						'site' : st,
						'ich' : ich,
						'tma' : tma,
						'status' : statusTma[1],
						'kondisi' : statusIch[1],
						'dt' : new Date(moment().add(7,'hours').format()),
					}
					console.log('Diseminasi running')
					console.log('')
					console.log(data)

					var dataToMongo = new floodRecord({ 
					  dt: new Date(moment().add(7,'hours').format()),
					  site: st,
					  tma: tma,
					  ch: data.ich,
					  vair: ktlm1.vair[0],
					  kondisi: statusIch[1],
					  status: statusTma[1]
					});
					dataToMongo.save(function (err) {
					  if (err) return handleError(err);
					  console.log("data disimpan dalam flood_rec")

					});
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



			
