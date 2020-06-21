const keys = require('../app/config/keys');
const accountSid = 'ACfd59eb2e39864f41da9fa597bd98f871'; 
const authToken = '23a598be854062dbc9eb9bf2ea54770b'; 
const client = require('twilio')(accountSid, authToken);
var moment = require('moment-timezone')
var mqtt = require('mqtt')
var clientMqtt  = mqtt.connect('mqtt://broker.mqttdashboard.com')
const q = require('q');
const webPush = require('web-push');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema config
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
var usersSchema = new Schema({});
var subsSchema = new Schema({});

//MongoDB Config
// var connection = mongoose.createConnection('mongodb://projek20:projek20@198.211.106.64:27017/siagabanjir',{useNewUrlParser: true,useUnifiedTopology: true});
var connection = mongoose.createConnection('mongodb://projek20:projek20@localhost/siagabanjir?replicaSet=rs0',{useNewUrlParser: true,useUnifiedTopology: true});
var DpsMain = connection.model('DpsMain', dpsMainSchema,'dpsMain');
var Flood = connection.model('Flood', dpsMainSchema,'flood_rec');
var Users = connection.model('Users', usersSchema,'users');
var Subscription = connection.model('Subscription', subsSchema,'subscribers');
var socket = require('socket.io-client').connect('http://localhost:3000');
const site=[221,222,223]

//dt

function pos(site){
    return site==221 ? 'Katulampa' :
    site==222 ? 'Depok' :
    site==223 ? 'Manggarai' :
    'Kedunggupit'
}


function sendWhatsappDef(payload,d,t,no){
    console.log('Diseminasi Whatsapp Running..')
    client.messages.create({
        from: 'whatsapp:+14155238886',
        body:  `Your Attention Required!-----Tanggal:${d}----Waktu:${t}----Pos:${pos(payload.site)}---Status:${payload.status}---Kondisi:${payload.kondisi}---TMA:${payload.tma} cm----ICH:${payload.ich} mm---- code is 112 for emergency`,
        to: 'whatsapp:+6285233333656'
        // to: 'whatsapp:+62'+no
    })
    .then((message) => 
        {
            console.log('Pesan Whatsapp:')
            console.log(message.body)
        }
    ).done();
}


function pushNotif(msgPushNotif){
    console.log('Diseminasi Push Notif Running...')

    console.log('Pesan Push Notif: ')
    console.log(msgPushNotif)
    const payload = {
        title: 'Peringatan Dini Banjir',
        message: msgPushNotif,
        url: 'https://peringatandini.site',
        // ttl: req.body.ttl,
        icon: 'https://peringatandini.site/images/warning.png',
        // image: 'https://peringatandini.site/images/favicon.png',
        badge: 'https://peringatandini.site/images/favicon.png',
        tag: 'https://peringatandini.site/images/favicon.png'
    };

    Subscription.find({}).lean().exec((err, subscriptions) => {
        if (err) {
            console.error(`Error occurred while getting subscriptions`);
            res.status(500).json({
                error: 'Technical error occurred'
            });
        } else {
            let parallelSubscriptionCalls = subscriptions.map((subscription) => {
                return new Promise((resolve, reject) => {
                    const pushSubscription = {
                        endpoint: subscription.endpoint,
                        keys: {
                            p256dh: subscription.keys.p256dh,
                            auth: subscription.keys.auth
                        }
                    };

                    const pushPayload = JSON.stringify(payload);
                    const pushOptions = {
                        vapidDetails: {
                            subject: "localhost:3000",
                            privateKey: keys.privateKey,
                            publicKey: keys.publicKey
                        },
                        TTL: payload.ttl,
                        headers: {}
                    };
                    webPush.sendNotification(
                        pushSubscription,
                        pushPayload,
                        pushOptions
                    ).then((value) => {
                        resolve({
                            status: true,
                            endpoint: subscription.endpoint,
                            data: value
                        });
                    }).catch((err) => {
                        reject({
                            status: false,
                            endpoint: subscription.endpoint,
                            data: err
                        });
                    });
                });
            });
            q.allSettled(parallelSubscriptionCalls).then((pushResults) => {
                // console.info(pushResults);
            });
        }
    });
}


function siteBuzzer(data,d,t){
    payload=d+' 't+','+pos(data.site)+','+data.tma+','+data.status+','+data.kondisi
    clientMqtt.publish('siteWarningDps', payload)
    console.log('')
    console.log('Publish data Pos Buzzer: ',payload)
}



socket.on('diseminasiOn',(msg)=>{
var d = moment().add(7,'hours').format('YYYY/MM/DD');
var t = moment().add(7,'hours').format('HH:mm:ss');    
    function msgPushNotif(data){
        msgPushNotif='Tanggal:'+d+'\n'+
        'Waktu:'+t+'\n'+
        'Pos:'+pos(data.site)+'\n'+
        `Kondisi: ${data.kondisi} (${data.ich} mm)\n` +
        `Status: ${data.status} (${data.tma} mm)\n`

        return msgPushNotif
    }
    console.log('Diseminasi Running...')
	var data = msg.data.data
    var payload = msgPushNotif(msg.data.data)
    
    console.log('Data akan didiseminasi: ')
    console.log(data)


    pushNotif(payload,tBuzzer)
    sendWhatsappDef(data,d,t)
    siteBuzzer(data)

    Users.find({}).lean().exec((err,resp)=>{
        resp.forEach((data)=>{
            // no = data.no
        })
    })

})

//Wa Manual
socket.on('waDiseminasi',(msg)=>{
    var d = moment().add(7,'hours').format('YYYY/MM/DD');
    var t = moment().add(7,'hours').format('HH:mm:ss');  
    var tBuzzer = moment().add(7,'hours').format('HH:mm');  
    var payload=msg.msgPayload
    console.log('payload')

    function sendWhatsappCustom(no){
        client.messages.create({
            from: 'whatsapp:+14155238886',
            body: `Your Attention Required!......
            ${payload}
            ....... code is 112 for emergency`,
            to: 'whatsapp:+6285233333656'
        })
        .then(message => console.log('Pesan Whatsapp\n',message.sid)).done();
    }
    if(msg.type=='default'){
        sendWhatsappDef(payload,d,t)
    }else{
        sendWhatsappCustom()
    }

    Users.find({}).lean().exec((err,resp)=>{
        resp.forEach((data)=>{
            // no = data.no.substring(1,12)
            // sendWhatsappDef(no)
        })
    })
})

//Push Notif Manual
socket.on('pushNotif',(msg)=>{
    var d = moment().add(7,'hours').format('YYYY/MM/DD');
    var t = moment().add(7,'hours').format('HH:mm:ss');  
    function msgPushNotif(data){
        msgPushNotif='Tanggal:'+d+'\n'+
        'Waktu:'+t+'\n'+
        'Pos:'+pos(data.site)+'\n'+
        'Status:'+data.status+'\n'+
        'Kondisi:'+data.kondisi+'\n'+
        'TMA:'+data.tma+'cm\n'+
        'ICH:' +data.ich+'mm\n'

        return msgPushNotif
    }
    console.log('Push Notif manual Running')
    if(msg.type=='custom'){
        pushNotif(msg.msgPayload)
    }else{
        data=msgPushNotif(msg.msgPayload)
        pushNotif(data)
    }
})




