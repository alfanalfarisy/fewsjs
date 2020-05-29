const keys = require('../app/config/keys');

// const accountSid = 'AC664a4d430f76c95f1087b5f7a9f34759'; 
// const authToken = '319f257a2ac633449f4c5258bca7ec4a'; 
const accountSid = 'ACbd694c940698af960c69d4ed424a9b50'; 
const authToken = '40d09861d3cb1febf29f3153f59d818a'; 
const client = require('twilio')(accountSid, authToken);

var mqtt = require('mqtt')
var clientMqtt  = mqtt.connect('mqtt://broker.mqttdashboard.com')


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dpcdMainSchema = new Schema({});
var dpsMainSchema = new Schema({});
var usersSchema = new Schema({});
var subsSchema = new Schema({});

//MongoDB Config
var connection = mongoose.createConnection('mongodb://localhost/siagabanjir?replicaSet=rs0',{useNewUrlParser: true,useUnifiedTopology: true});
var Dpcd = connection.model('DpcdMain', dpcdMainSchema,'dpcdMain');
var Dps = connection.model('DpsMain', dpsMainSchema,'dpsMain');
var Users = connection.model('Users', usersSchema,'users');

var socket = require('socket.io-client').connect('http://localhost:3000');

//dt
var dt = new Date()
dt.setHours(dt.getHours() + 7)
c=dt.toString()
d= c.substring(8,10)+'/'+c.substring(4,7)+'/'+c.substring(11,15)
t= c.substring(16,24)

function sendWhatsappDef(payload,no){
	client.messages.create({
		from: 'whatsapp:+14155238886',
		body:  `Your Attention Required!
		${payload}

		code is 112 for emergency`,
		to: 'whatsapp:+6285233333656'
	})
	.then(message => console.log(message.sid)).done();
}


function mean(){
	var start = new Date(); //Date Now 
	var m = start.getMinutes(); //get 10 Minute
	var end = new Date(); //Date Now


	if(m==0){
	Promise.all([
		Users.find({'admin' : true}).lean(),
		Dpcd.findOne({'site':331}).sort({_id:-1}).lean(),
		Dpcd.findOne({'site':221}).sort({_id:-1}).lean(),
		Dpcd.findOne({'site':222}).sort({_id:-1}).lean(),
		Dpcd.findOne({'site':223}).sort({_id:-1}).lean(),
		Dps.findOne({'site':331}).sort({_id:-1}).lean(),
		Dps.findOne({'site':221}).sort({_id:-1}).lean(),
		Dps.findOne({'site':222}).sort({_id:-1}).lean(),
		Dps.findOne({'site':223}).sort({_id:-1}).lean(),

		]).then(result=>{
			const [users,dpcdWwr,dpcdKtlmp,dpcdDpk,dpcdMgr,dpsWwr,dpsKtlmp,dpsDpk,dpsMgr]=result;
			var status={
				1000:'valid',
				1001:'Empty',
				1002:'Outrange',
				1003:'down'
			}

			message=`
			POS: Wawar
			Dps: ${status[dpsWwr.tma[1]]}/${status[dpsWwr.ch[1]]}/${status[dpsWwr.vair[1]]}
			Update : ${dpsWwr.dt.toString().substring(0,21)}
			Dpcd : ${dpcdWwr.vbr[0]}/${dpcdWwr.vbr[0]}/${dpcdWwr.stc}
			Update :${dpcdWwr.dt.toString().substring(0,21)}

			POS: Katlampa
			Dps: ${status[dpsKtlmp.tma[1]]}/${status[dpsKtlmp.ch[1]]}/${status[dpsKtlmp.vair[1]]}
			Update : ${dpsKtlmp.dt.toString().substring(0,21)}
			Dpcd : ${dpcdKtlmp.vbr[0]}/${dpcdKtlmp.vbr[0]}/${dpcdKtlmp.stc}
			Update :${dpcdKtlmp.dt.toString().substring(0,21)}

			POS: Depok
			Dps: ${status[dpsDpk.tma[1]]}/${status[dpsDpk.ch[1]]}/${status[dpsDpk.vair[1]]}
			Update : ${dpsDpk.dt.toString().substring(0,21)}
			Dpcd : ${dpcdDpk.vbr[0]}/${dpcdDpk.vbr[0]}/${dpcdDpk.stc}
			Update :${dpcdDpk.dt.toString().substring(0,21)}

			POS: Manggarai
			Dps: ${status[dpsMgr.tma[1]]}/${status[dpsMgr.ch[1]]}/${status[dpsMgr.vair[1]]}
			Update : ${dpsMgr.dt.toString().substring(0,21)}
			Dpcd : ${dpcdMgr.vbr[0]}/${dpcdMgr.vbr[0]}/${dpcdMgr.stc}
			Update :${dpcdMgr.dt.toString().substring(0,21)}`

			pload=
				dpcdWwr.site+','+dpcdWwr.stc+','+dpcdWwr.dt.toString().substring(16,21)+','+dpcdWwr.vbr+','+
				dpcdKtlmp.site+','+dpcdKtlmp.stc+','+dpcdKtlmp.dt.toString().substring(16,21)+','+dpcdKtlmp.vbr+','+
				dpcdDpk.site+','+dpcdDpk.stc+','+dpcdDpk.dt.toString().substring(16,21)+','+dpcdDpk.vbr+','+
				dpcdMgr.site+','+dpcdMgr.stc+','+dpcdMgr.dt.toString().substring(16,21)+','+dpcdMgr.vbr
			
			console.log(pload)
			clientMqtt.publish('siteWarningDpcd', pload)
		
			console.log(message)
		
			users.forEach((user)=>{
				no = user.no
				// sendWhatsappDef(message,no)
			})

		})
	}
}
setInterval(mean,60000)
