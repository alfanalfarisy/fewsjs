const keys = require('../app/config/keys');
const accountSid = 'ACfd59eb2e39864f41da9fa597bd98f871'; 
const authToken = '956869913154159d25cb971e35030597'; 
var moment = require('moment')
const client = require('twilio')(accountSid, authToken);
var mqtt = require('mqtt')
var clientMqtt  = mqtt.connect('mqtt://broker.mqttdashboard.com')
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//MongoDB Config
var dpcdMainSchema = new Schema({});
var dpsMainSchema = new Schema({});
var usersSchema = new Schema({});
var subsSchema = new Schema({});
var connection = mongoose.createConnection('mongodb://projek20:projek20@localhost/siagabanjir?replicaSet=rs0',{useNewUrlParser: true,useUnifiedTopology: true});
var Dpcd = connection.model('DpcdMain', dpcdMainSchema,'main_dpcd');
var Dps = connection.model('DpsMain', dpsMainSchema,'main_dps');
var Users = connection.model('Users', usersSchema,'users');

var socket = require('socket.io-client').connect('http://localhost:3000');

//dt
var d = moment().format('YYYY/MM/DD');
var t = moment().format('hh:mm:ss');    

function sendWhatsappDef(payload,no){
	client.messages.create({
		from: 'whatsapp:+14155238886',
		body:  payload,
		to: 'whatsapp:+6285233333656'
	})
	.then().done();
}


function mean(){
	var start = moment().add(7,"hours").format();
	var m = moment().add(7,"hours").minutes();

	// if(m==0){
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


			pload=
				dpcdWwr.site+','+moment(start).format("YYYY-MM-DD HH:mm:ss")+','+dpcdWwr.skb[0]+','+dpcdWwr.edb[0]+','+dpcdWwr.inps[0]+','+dpcdWwr.t[0]
				// dpcdKtlmp.site+','+dpcdKtlmp.stc+','+dpcdKtlmp.dt.toString().substring(16,21)+','+dpcdKtlmp.vbr+','+
				// dpcdDpk.site+','+dpcdDpk.stc+','+dpcdDpk.dt.toString().substring(16,21)+','+dpcdDpk.vbr+','+
				// dpcdMgr.site+','+dpcdMgr.stc+','+dpcdMgr.dt.toString().substring(16,21)+','+dpcdMgr.vbr
			message=`POS: Kedunggupit
Data Pengamatan Sungai: 
1. TMA: ${status[dpsWwr.tma[1]]}
2. CH : ${status[dpsWwr.ch[1]]}
3. V air :${status[dpsWwr.vair[1]]}
Update : ${moment('2020-06-22 07:33:13').format("YYYY-MM-DD HH:mm:ss")}
Dpcd Pengamatan Catu Daya: 
1. SKB : ${dpcdWwr.skb[0]} % 
2. EDB :${dpcdWwr.edb[0]} Jam
3. Index PS :${dpcdWwr.inps[0]}
3. Suhu :${dpcdWwr.t[0]} C
Update : ${moment('2020-06-22 07:33:13').format("YYYY-MM-DD HH:mm:ss")}`
// POS: Katlampa
// Dps: ${status[dpsKtlmp.tma[1]]}/${status[dpsKtlmp.ch[1]]}/${status[dpsKtlmp.vair[1]]}
// Update : ${dpsKtlmp.dt.toString().substring(0,21)}
// Dpcd : ${dpcdKtlmp.vbr[0]}/${dpcdKtlmp.vbr[0]}/${dpcdKtlmp.stc}
// Update :${dpcdKtlmp.dt.toString().substring(0,21)}

// POS: Depok
// Dps: ${status[dpsDpk.tma[1]]}/${status[dpsDpk.ch[1]]}/${status[dpsDpk.vair[1]]}
// Update : ${dpsDpk.dt.toString().substring(0,21)}
// Dpcd : ${dpcdDpk.vbr[0]}/${dpcdDpk.vbr[0]}/${dpcdDpk.stc}
// Update :${dpcdDpk.dt.toString().substring(0,21)}

// POS: Manggarai
// Dps: ${status[dpsMgr.tma[1]]}/${status[dpsMgr.ch[1]]}/${status[dpsMgr.vair[1]]}
// Update : ${dpsMgr.dt.toString().substring(0,21)}
// Dpcd : ${dpcdMgr.vbr[0]}/${dpcdMgr.vbr[0]}/${dpcdMgr.stc}
// Update :${dpcdMgr.dt.toString().substring(0,21)}
// console.log(dpcdWwr)

			console.log("Publish ke Site Buzzer Teknisi: ")
			console.log(pload)
			clientMqtt.publish('siteWarningDpcd', pload)
			
			console.log(" ")
			console.log("Diseminasi pesan whatsapp : ")
			console.log(message)
		
			sendWhatsappDef(message)
			users.forEach((user)=>{
				no = user.no
			})

		})
	// }
}
setInterval(mean,5000)
