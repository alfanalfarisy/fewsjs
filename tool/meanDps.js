var mongoose = require('mongoose');
var moment = require('moment-timezone')

//Skema DPS Level 2 MongoDB
var Schema = mongoose.Schema;
var dpsMainSchema = new Schema({
	dt: Date,
	site: [Number],
	tma: [Number,Number],
	vair: [Number,Number],
	ch: [Number,Number]

	},{
		timestamps: true
	});

//MongoDB Config
var connection = mongoose.createConnection('mongodb://projek20:projek20@localhost/siagabanjir?replicaSet=rs0',{useNewUrlParser: true,useUnifiedTopology: true});
// var DpsMain = connection.model('DpsMain', dpsMainSchema,'main_dps');
var DpsMain = connection.model('DpsMain', dpsMainSchema,'main_dps_tes');
var DpsTemp = connection.model('DpsTemp', dpsMainSchema,'temp_dps');

var socket = require('socket.io-client')('http://localhost:3000');

//MQTT
var mqtt = require('mqtt')
var clientMqtt  = mqtt.connect('mqtt://broker.mqttdashboard.com')


const st=[221,222,223,331]


// Function Looping Every 10 Minute
function mean(){
	var start = moment().add(7,'hours').format();
	var m = moment().minutes();

	// if(m==40){
	if(m==10||m==20||m==30|m==46||m==50||m==0){
		var end = moment().add(7,'hours').subtract(10, 'minutes').format(); 	 	
		console.log('Range data data : ', [start,end])
		console.log('Proses pengambilan nilai rata-rata 10 menit ...')
		
		st.forEach(function(st){
			//	query data last 10 minute
			DpsTemp.find({'site':st,'dt':{$lt:start,$gt:end}}).lean().exec(function(err,res){
			// DpsTemp.find({'site':st}).lean().exec(function(err,res){
				console.log('Pengambilan nilai rata-rata untuk pos pengamatan', st)
				console.log('Jumlah record data :', res.length)
				console.table(res)
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

						ch=[data.ch[0],data.ch[1]]

					})

				}else{
					tma=[-1,1003]	
					vair=[-1,1003]	
					ch=[-1,1003]
				}

				var dataToMongo = new DpsMain({ 
					dt: new Date(moment().add(7,'hours').format()),
					site: st,
					tma: tma,
					vair: vair,
					ch: ch
				});

				console.log('Penjumlahan TMA Valid :', sumTma)
				console.log('total record TMA Valid :', tmaValid)
				console.log('rata-rata TMA :', tma)
				console.log('Penjumlahan V air Valid :', Math.round(sumVair*100)/100)
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

	
		setTimeout(()=>{socket.emit('meanDone', true)},500)

	}
}
setInterval(mean,60000) //looping 10 minute

