var mqtt = require('mqtt');
var mongoose = require('mongoose');
var Topic = 'dpsclwg'; 
// var Broker_URL = 'mqtt://test.mosquitto.org';
var Broker_URL = 'mqtt://broker.mqttdashboard.com';
var options = {
	clientId: 'projek20',
	port: 1883,
	username: 'projek20',
	password: 'projek20',	
	keepalive : 60
};

//mqtt konfig
var client  = mqtt.connect(Broker_URL, options);
client.on('connect', mqtt_connect);
client.on('reconnect', mqtt_reconnect);
client.on('error', mqtt_error);
client.on('message', mqtt_messsageReceived);
client.on('close', mqtt_close);

const moment = require('moment-timezone');
// const dateJkt = moment.tz(Date.now(), "Asia/Bangkok");


//skema Dokumen DPS MongoDB
var Schema = mongoose.Schema;
var dpsTempSchema = new Schema({
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
var DpsTemp = connection.model('DpsTemp', dpsTempSchema,'temp_dps');

function mqtt_connect() {
    console.log("Connecting MQTT");
    client.subscribe(Topic, mqtt_subscribe);
}

function mqtt_subscribe(err, granted) {
    console.log("Subscribed to " + Topic);
    if (err) {console.log(err);}
}

function mqtt_reconnect(err) {
    console.log("Reconnect MQTT");
    if (err) {console.log(err);}
	client  = mqtt.connect(Broker_URL, options);
}

function mqtt_error(err) {
    console.log("Error!");
	if (err) {console.log(err);}
}

function after_publish() {
	//do nothing
}

function mqtt_messsageReceived(topic, message, packet) {
	console.log('Data pengamatan sungai diterima')
	var payload=message.toString() // Payload to String
	console.log('data : ', payload)
	var array = payload.split(",") //SPLIT
	var st =array[0]; //Pos Pengirim
	var vTma =array[2]; //Nilai TMA

	//Function QC Water Level
	function qc(par,min,max){
			return par=='' ? [-1,1001] :
			par>=min&&par<max ? [par,1000] :
			[-1,1002]
	}
	tma=(data)=>{
		return st==221 ? qc(vTma,0,350) : 
		st==222 ? qc(vTma,0,550) : 
		// st==223 ? qc(vTma,420,1000) :
		st==223 ? qc(vTma,0,400) :
		qc(vTma,0,500)
		// qc(vTma,200,500)
	}

	// Validasi Value Datetime
	var dt=array[1];
	if(dt){
		var dt=dt.substring(0,4)+'-'+dt.substring(4,6)+'-'+dt.substring(6,8)+'T'+dt.substring(8,10)+':'+dt.substring(10,12)+':00'
	} else {
		dt = new Date();
	}

	//Dokumen DPS 
	var data={	
		'st': st,
		'dt': dt,
		'tma': tma(data),
		'vair': qc(array[3],0,3.14),
		'ch': qc(array[4],0,115)
	}
	console.log('Proses pengendalian mutu data')
	console.log(data)

	//Save Dokument to MongoDB
	var dataToMongo = new DpsTemp({ 
	  // dt: data.dt,
	  dt: new Date(data.dt),
	  site: data.st,
	  tma: data.tma,
	  vair: data.vair,
	  ch: data.ch
	});
	if(data.st){
		dataToMongo.save(function (err) {
		  // if (err) return handleError(err);
		  console.log(err)
		  console.log("Data telah disimpan dalam database")
	
		});
	}else{
		console.log('Data tidak disimpan')
	}
}

function mqtt_close() {
	console.log("Close MQTT");
}




