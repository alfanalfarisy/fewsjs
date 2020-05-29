const keys = require('../app/config/keys');
const accountSid = 'ACbd694c940698af960c69d4ed424a9b50'; 
const authToken = '3a959f57035d4ddd37ac5770f4cd76d1'; 
const client = require('twilio')(accountSid, authToken);


var mqtt = require('mqtt')
var clientMqtt  = mqtt.connect('mqtt://broker.mqttdashboard.com')
const q = require('q');
const webPush = require('web-push');

var mongoose = require('mongoose');
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

var usersSchema = new Schema({});
var subsSchema = new Schema({});

//MongoDB Config
var connection = mongoose.createConnection('mongodb://localhost/siagabanjir?replicaSet=rs0',{useNewUrlParser: true,useUnifiedTopology: true});
var DpsMain = connection.model('DpsMain', dpsMainSchema,'dpsMain');
var Users = connection.model('Users', usersSchema,'users');
var Subscription = connection.model('Subscription', subsSchema,'subscribers');

var socket = require('socket.io-client').connect('http://localhost:3000');
const site=[221,222,223]

//dt
var dt = new Date()
dt.setHours(dt.getHours() + 7)
c=dt.toString()
d= c.substring(8,10)+'/'+c.substring(4,7)+'/'+c.substring(11,15)
t= c.substring(16,24)

function sendWhatsappDef(payload,no){
    console.log('Diseminasi Whatsapp Running..')
    client.messages.create({
        from: 'whatsapp:+14155238886',
        body: `Your Attention Required!-----Tanggal:${d}----Waktu:${t}----Pos:${payload.pos}---Status:${payload.status}---Kondisi:${payload.kondisi}---TMA:${payload.tma}cm----ICH:${payload.ich}mm code is 112 for emergency`,
        to: 'whatsapp:+6285233333656'
        // to: 'whatsapp:+62'+no
    })
    .then((message) => 
        {   console.log('Pesan Whatsapp:'),
            console.log(message.body)
        }
    ).done();
}

function pushNotif(data){
    console.log('Diseminasi Push Notif Running...')
    msgPushNotif='Tanggal:'+d+'\n'+
        'Waktu:'+t+'\n'+
        'Pos:'+data.pos+'\n'+
        'Status:'+data.status+'\n'+
        'Kondisi:'+data.kondisi+'\n'+
        'TMA:'+data.tma+'cm\n'+
        'ICH:' +data.ich+'mm\n'
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
                console.info(pushResults);
            });
        }
    });
}


function siteBuzzer(data){
    payload=data.st+','+data.tma+','+data.status+','+data.kondisi
    clientMqtt.publish('siteWarningDps', payload)
}

socket.on('diseminasiOn',(msg)=>{

    console.log('Diseminasi Manual Running...')
	var data = msg.data.data
    var payload = msg.data.data
    
    console.log('Data akan didiseminasi: ')
    console.log(data)

    pushNotif(data)
    sendWhatsappDef(payload)
    siteBuzzer(data)

    Users.find({}).lean().exec((err,resp)=>{
        resp.forEach((data)=>{
            // no = data.no
        })
    })

})

//Wa Manual
socket.on('waDiseminasi',(msg)=>{
    var payload=msg.msgPayload
    console.log('payload')

    function sendWhatsappCustom(no){
        client.messages.create({
            from: 'whatsapp:+14155238886',
            body: `Your Attention Required!......
            ${payload}
            .......code is 112 for emergency`,
            to: 'whatsapp:+6285233333656'
        })
        .then(message => console.log('Pesan Whatsapp\n',message.sid)).done();
    }
    if(msg.type=='default'){
        sendWhatsappDef(payload)
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
    console.log('Push Notif manual Running')
    data=msg.msgPayload
    pushNotif(data)
})




