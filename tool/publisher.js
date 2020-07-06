var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://broker.mqttdashboard.com',{
  protocolId: 'MQIsdp',
  protocolVersion: 3
});
var moment = require('moment-timezone').tz.setDefault("Asia/Jakarta");

data= [
[331,202006232302,60,0.42,0],
[331,202006232304,65,0.45,0],
[331,202006232306,70,0.48,0],
[331,202006232308,70,0.42,0],
[331,202006232310,68,0.41,0],

[331,202006232312,120,0.62,1],
[331,202006232314,110,0.65,2],
[331,202006232316,120,0.68,3],
[331,202006232318,120,0.62,3],
[331,202006232320,110,0.61,3],

[331,202006232322,180,0.92,1],
[331,202006232324,170,0.95,3],
[331,202006232326,184,0.98,3],
[331,202006232328,167,0.92,4],
[331,202006232330,170,0.91,4],

[331,202006232332,270,1.42,5],
[331,202006232334,260,1.45,5],
[331,202006232336,280,1.48,7],
[331,202006232338,280,1.42,8],
[331,202006231840,276,1.41,8]]

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
		d < 10 ? d='0'+d : d
		h=moment().hours()
		h < 10 ? h='0'+h : h
		m=moment().minutes()
		m < 10 ? m='0'+m : m
		
		
		
		client.publish('dpsclwg',`${data},${y}${b}${d}${h}${m},${tma},${dbt},${ch}`)
		console.log(`Publish Data :`)
		console.log(`${data},${y}${b}${d}${h}${m},${tma},${dbt},${ch}`)
	})
}

data.forEach((data)=>{
	console.log(data)
	client.publish('dpswwr',`${data}`)
})

// setInterval(publish,120000)