var mqtt = require('mqtt');
var mongoose = require('mongoose');
var Topic = 'dpcdwwr'; 
// var Broker_URL = 'mqtt://test.mosquitto.org';
var Broker_URL = 'mqtt://broker.mqttdashboard.com';
var options = {
	// clientId: '',
	port: 1883,
	// username: '',
	// password: '',	
	keepalive : 60
};

//mqtt Konfig
var client  = mqtt.connect(Broker_URL, options);
client.on('connect', mqtt_connect);
client.on('reconnect', mqtt_reconnect);
client.on('error', mqtt_error);
client.on('message', mqtt_messsageReceived);
client.on('close', mqtt_close);

//skema Dokumen DPCD 
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
	irl: [Number,Number]
},
{
    timestamps: true
});

//MongoDB Konfigutasi 
var connection = mongoose.createConnection('mongodb://projek20:projek20@localhost/siagabanjir?replicaSet=rs0',{useNewUrlParser: true,useUnifiedTopology: true});
var DpcdMain = connection.model('DpcdMain', dpcdMainSchema,'main_dpcd');

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
}

function mqtt_messsageReceived(topic, message, packet) {

	console.log('Data pengamatan catu daya diterima')
	var payload=message.toString()
	console.log('Data masuk : ',payload)
	var array = payload.split(",")

	//function QC
	function qc(par,min,max){
			return par=='' ? [-1,1001] :
			par>=min&&par<=max ? [par,1000] :
			[-1,1002]
	}
	// Validasi Value Datetime
	var dt=array[1];
	if(dt){
		var dt=dt.substring(0,4)+'-'+dt.substring(4,6)+'-'+dt.substring(6,8)+'T'+dt.substring(8,10)+':'+dt.substring(10,12)+':'+dt.substring(12,14)
	} else {
		dt = new Date();
	}

	//payload dokument 1 record
	var data={
		'st': array[0],
		'dt': dt,
		'lx': qc(array[2],0,100000),
		't': qc(array[3],-40,820),
		'skb': qc(array[4],-40,30000),
		'edb': qc(array[5],-40,30000),
		'wps': qc(array[6],-40,30000),
		'inps': qc(array[7],-40,30000),
		'vpr': qc(array[8],0,30000),
		'vbr': qc(array[9],0,30000),
		'vrl': qc(array[10],0,30000),
		'ibr': qc(array[11],0,30000),
		'ipr': qc(array[12],0,30000),
		'irl': qc(array[13],0,30000)	
	}
	console.log('proses pengendalian mutu data')
	console.log(data)

	//insert to MongoDB
	var dataToMongo = new DpcdMain({ 
	  site: data.st,
	  dt: new Date(dt),
	  lx: data.lx,
	  t: data.t,
	  skb: data.skb,
	  edb: data.edb,
	  wps: data.wps,
	  inps: data.inps,
	  vpr: data.vpr,
	  vbr: data.vbr,
	  vrl: data.vrl,
	  ipr: data.ipr,
	  ibr: data.ibr,
	  irl: data.irl
	});
	dataToMongo.save(function (err) {
	  // if (err) return handleError(err);
	  console.log("data telah disimpan dalam basis data")

	});
}


function mqtt_close() {
	console.log("Close MQTT");
}


// mqtt pub -t 'suhucok' -h 'test.mosquitto.org' -m '{"Tanggal":"2019-12-8","Waktu":"19:17:06","stasiun":"sitea","tma":"10","ch":"11","debit":"20","status":{"tma":"OK","debit":"OK","ch":"OK"}}'





