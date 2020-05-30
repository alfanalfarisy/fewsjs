var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://broker.mqttdashboard.com',{
  protocolId: 'MQIsdp',
  protocolVersion: 3
});
var moment = require('moment-timezone').tz.setDefault("Asia/Jakarta");


function publish(){
	st=[221,222,223,331]
	st.forEach((data)=>{
		tma=Math.floor(Math.random() * 200) + 50
		dbt=Math.floor(Math.random() * 3) + 0
		ch=Math.floor(Math.random() * 30) + 0
		y=moment().year()
		b=moment().month()+1
		b='0'+b
		d=moment().date()
		h=moment().hours()
		m=moment().minutes()
		s=moment().second()
		
		client.publish('dpsclwg',`${data},${y}${b}${d}${h}${m}${s},${tma},${dbt},${ch}`)
		console.log(`${data},${y}${b}${d}${h}${m}${s},${tma},${dbt},${ch}`)
	})
}

setInterval(publish,10000)