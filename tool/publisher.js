var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://broker.mqttdashboard.com',{
  protocolId: 'MQIsdp',
  protocolVersion: 3
});
var moment = require('moment-timezone').tz.setDefault("Asia/Jakarta");
var socket = require('socket.io-client')('http://localhost:3000');

data= [
[331,20200705080212,60,0.42,0],
[331,20200705080412,65,0.45,0],
[331,20200705080612,70,0.48,0],
[331,20200705080812,70,0.42,0],
[331,20200705081012,68,0.41,0],

[331,20200705081212,120,0.62,1],
[331,20200705081412,110,0.65,2],
[331,20200705081612,120,0.68,3],
[331,20200705081812,120,0.62,3],
[331,20200705082012,110,0.61,3],

[331,20200705082212,180,0.92,3],
[331,20200705082412,170,0.95,3],
[331,20200705082612,184,0.98,3],
[331,20200705082812,167,0.92,4],
[331,20200705083012,170,0.91,4],

[331,20200705083212,270,1.42,5],
[331,20200705083412,260,1.45,5],
[331,20200705083612,280,1.48,7],
[331,20200705083812,280,1.42,8],
[331,20200705084012,276,1.41,8]]


dpcd = {
   "lx": 43499.52,
   "t": 31.7,
   "skb": 56,
   "edb": 10.38,
   "wps": 4.598,
   "inps": 1.059,
   "vpr": 12.596,
   "vbr": 12.752,
   "vrl": 12.276,
   "ipr": 0.365,
   "ibr": 0.088,
   "irl": 0.403
 }



function generateDt(){
	y=moment().year()
	b=moment().month()+1
	b < 10 ? b='0'+b : b
	d=moment().date()
	d < 10 ? d='0'+d : d
	h=moment().hours()
	h < 10 ? h='0'+h : h
	m=moment().minutes()
	m < 10 ? m='0'+m : m
	s=moment().seconds()
	s < 10 ? s='0'+s : s
}

function publish(){
	st=[221]
	generateDt()

	st.forEach((st)=>{
		tma=Math.floor(Math.random() * 200) + 50
		dbt=Math.floor(Math.random() * 3) + 0
		ch=Math.floor(Math.random() * 30) + 0
		
		payloadDps=`${st},${y}${b}${d}${h}${m}${s},${tma},${dbt},${ch}`
		client.publish('dpswwr',payloadDps)
		console.log(`Publish Data :`)
		console.log(payloadDps)
		socket.emit('publishDpsToBot', payloadDps);

	})
}

function publishDpcd(){
	generateDt()
	st=[221,222,223,331]
	st.forEach((st)=>{
		payloadDpcd=`${st},${y}${b}${d}${h}${m}00,${dpcd.lx},${dpcd.t},${dpcd.skb},${dpcd.edb},${dpcd.wps},${dpcd.inps},${dpcd.vpr},${dpcd.vbr},${dpcd.vrl},${dpcd.ipr},${dpcd.ibr},${dpcd.irl},`
			client.publish('dpcdwwr',payloadDpcd)
			console.log(payloadDpcd)
		socket.emit('publishDpcdToBot', payloadDpcd);		
	})
}
setInterval(publish,10000)
setInterval(publishDpcd,600000)



