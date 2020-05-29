var mongoose = require('mongoose');

//Skema DPS Level 2 MongoDB
var Schema = mongoose.Schema;
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

//MongoDB Config
var connection = mongoose.createConnection('mongodb://localhost/siagabanjir?replicaSet=rs0',{useNewUrlParser: true,useUnifiedTopology: true});
var DpsMain = connection.model('DpsMain', dpsMainSchema,'dpsMainTes');
var DpsTemp = connection.model('DpsTemp', dpsMainSchema,'dpsTemp');

var socket = require('socket.io-client')('http://localhost:3000');

//MQTT
var mqtt = require('mqtt')
var clientMqtt  = mqtt.connect('mqtt://broker.mqttdashboard.com')


const st=[221,222,223,331]


//Function Looping Every 10 Minute
function mean(){
	var start = new Date(); //Date Now 
	var m = start.getMinutes(); //get 10 Minute
	var end = new Date(); //Date Now


	if(m==10||m==20||m==33||m==40||m==50||m==0){
		console.log('Proses pengambilan nilai rata-rata 10 menit ...')
		end.setMinutes(end.getMinutes() - 10); // Make a date - 10 minute
		// console.log(m)

		st.forEach(function(st){
			//	query data last 10 minute
			DpsTemp.find({'site':st,'dt':{$lte:start}}).lean().exec(function(err,res){
				console.log('Pengambilan nilai rata-rata untuk pos pengamatan', st)
				console.log('Jumlah record data :', res.length)

				//deklarasi Variabel
				var tma; var sumTma=0; var tmaValid=0; var tmaEmp=0; var tmaEr=0;
				var vair; var sumVair=0; var vairValid=0; var vairEmp=0; var vairEr=0;
				var ch;
				if(res.length!=0){
					//looping untuk setiap dokumen 
					res.forEach((data)=>{

						//Sum for mean 
						function meanTma(){
							sumTma+=data.tma[0];  
							tmaValid+=1
						}
						function meanVair(){
							sumVair+=data.vair[0];  
							vairValid+=1
						}
						//tma
						data.tma[1]==1000 ? meanTma() :
						data.tma[1]==1002 ? tmaEr+=1 : tmaEmp+=1
						//laju air
						data.vair[1]==1000 ? meanVair() :
						data.vair[1]==1002 ? vairEr+=1 : vairEmp+=1
						
						//Perhitungan rata2 TMA
						if(tmaValid!=0){
							tma = Math.round(sumTma/tmaValid)
							tma = [tma,1000]
						}else if (tmaEr!=0){
							tma=[-1,1002]
						}else{
							tma=[-1,1001]
						}

						//Perhitungan rata2 Laju air
						if(vairValid!=0){
							vair = sumVair/vairValid
							vair = Math.round(vair*100)/100
							vair = [vair,1000]
						}else if (vairEr!=0){
							vair =[-1,1002]
						}else{
							vair=[-1,1001]
						}

						ch=data.ch[0]

					})

				}else{
					tma=[-1,1003]	
					vair=[-1,1003]	
					ch=[-1,1003]
				}

				var dataToMongo = new DpsMain({ 
					dt: start,
					site: st,
					tma: tma,
					vair: vair,
					ch: ch
				});

				console.log('Penjumlahan TMA Valid :', sumTma)
				console.log('total record TMA Valid :', tmaValid)
				console.log('rata-rata TMA :', tma)
				console.log('Penjumlahan V air Valid :', sumVair)
				console.log('total record V air Valid :', vairValid)
				console.log('rata-rata V air :', vair)
				console.log('CH (tidak mengikuti proses penghitungan rata-rata):', ch)
				console.log('')



					dataToMongo.save(function (err) {
						if (err) return handleError(err);
						console.log("Data disimpan")
					});
			})
		})

		socket.emit('meanDps', {})

	}
}
setInterval(mean,60000) //looping 10 minute

