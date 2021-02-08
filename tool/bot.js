const TelegramBot = require('node-telegram-bot-api');
const token = '1483774003:AAEwdBHg4cIOG_EiivpOG0t8G3R8I8iCzNM';
const bot = new TelegramBot(token, {polling: true});
var socket = require('socket.io-client')('http://localhost:3000');
var mongoose = require('mongoose');
var connection = mongoose.createConnection('mongodb://projek20:projek20@localhost/siagabanjir?replicaSet=rs0',{useNewUrlParser: true,useUnifiedTopology: true});
var Schema = mongoose.Schema;
var moment = require('moment-timezone')
var bot_subsSchema = new Schema({
    id: Number,
    username: String,
    fisrtname: String,
    subs: {
      dps : Boolean,
      dpcd : Boolean
    }
});
var Bot_subs = connection.model('Bot_subs', bot_subsSchema,'bot_subs');


bot.onText(/\/subscribe/, (msg, match) => {
  const chatId = msg.chat.id;
    var opt={  
          reply_markup: {
            inline_keyboard: [
              [{ text: 'DPS', callback_data: 'dps'}],
              [{ text: 'DPCD', callback_data: 'dpcd'}],
              [{ text: 'Help', callback_data: 'help'}],
              [{ text: 'stop', callback_data: 'stop'}]
            ]
          }
    }

    bot.sendMessage(msg.chat.id,'Pilih Diseminasi yang ingin anda inginkan?',opt);  
});
bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;
    bot.sendMessage(msg.chat.id,'Ini merupakan Bot diseminasi!');  
});


bot.onText(/\/registrasi/, (msg, match) => {
  const chatId = msg.chat.id;
  // if(msg.text.toLowerCase().indexOf('/subscribe')===0){
  // };
    bot.sendMessage(msg.chat.id,'Masukkan nama anda : ');
    // console.log(msg)
});

function save(id,username,fisrtname,dps,dpcd){
  var dataToMongo = new Bot_subs({ 
    'id': id,
    'username': username,
    'fisrtname': fisrtname,
    'subs': {
      'dps': dps,
      'dpcd' : dpcd
    }
  });
    dataToMongo.save(function (err) {
      if (err) return handleError(err);
      // console.log(err)
      console.log("Data telah disimpan dalam database")
    });
}



bot.on('callback_query', function onCallbackQuery(callbackQuery) {
    console.log(callbackQuery)
    const data = callbackQuery.data;
    const opts = {
        chat_id: callbackQuery.message.chat.id,
        username: callbackQuery.from.username,
        fisrtname: callbackQuery.from.fisrtname,
    };
   if(data === "dpcd") {
      bot.sendMessage(opts.chat_id,'Anda berlangganan diseminasi data catu daya sungai dari kami')
      Bot_subs.find({'username':opts.username},(err,res)=>{
        console.log(res)
        if(res.length==0){
          save(opts.chat_id,opts.username,opts.first_name,false,true)
        }else{
          if(res[0].subs.dpcd==false){
            console.log(opts.username)
            Bot_subs.updateOne({'username':opts.username},{$set:{'subs.dpcd':true}},(err,res)=>{})
            console.log('dpcdupda')
          }
        }
      })

    }
    if (data === 'dps') {
      bot.sendMessage(opts.chat_id,'Anda berlangganan diseminasi data pengamatan sungai dari kami');
      Bot_subs.find({'username':opts.username},(err,res)=>{
        console.log(res)
        if(res.length==0){
          save(opts.chat_id,opts.username,opts.first_name,true,false)
        }else{
          console.log('OK')
          if(res[0].subs.dps==false){
            Bot_subs.updateOne({'username':opts.username},{$set:{'subs.dps':true}},(err,res)=>{})
          }
        }
      })

    }

    if(data === "help") {
      bot.sendMessage(opts.chat_id,'Ini merupakan bot diseminasi!')
    }
    if(data === "stop") {
      bot.sendMessage(opts.chat_id,'Anda berhenti berlangganan diseminasi data')
      Bot_subs.deleteOne({'username':opts.username},(err,res)=>{
        console.log(err)
      })
    }
});


bot.on('message', (msg) => {
  const chatId = msg.chat.id; 
  dataFilter=[msg]
  if(dataFilter){
    var result = dataFilter.filter(function(e){return msg.chat.id == chatId})}

})
bot.on('polling_error', error => console.log(error))

// socket.on('publishDpsToBot',(data)=>{
//   // console.log(data)
//   Bot_subs.find({'subs.dps':true}).lean().exec((err,res)=>{
//     res.forEach((res)=>{
//       bot.sendMessage(res.id, `Data DPS: ${data}`);
//       console.log('successdpcd')
//     })
//   })

// })

socket.on('publishDpsToBot',msg => {
    console.log(msg)
})

socket.on('publishDpcdToBot',(data)=>{
Bot_subs.find({'subs.dpcd':true}).lean().exec((err,res)=>{
    res.forEach((res)=>{
      bot.sendMessage(res.id, `Data DPS: ${data}`);
    })
  })
})

function pos(site){
    return site==221 ? 'Katulampa' :
    site==222 ? 'Depok' :
    site==223 ? 'Manggarai' :
    'Kedunggupit'
}


socket.on('teleNotifDefault',(msg)=>{
    console.log(msg)
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
    payload = msgPushNotif(msg.msgPayload)
    console.log('Telegram manual Running')
    Bot_subs.find().lean().exec((err,res)=>{
      res.forEach((res)=>{
        console.log('tes')
        bot.sendMessage(res.id, payload);
      })
    })
      
})

  // msg.text.toLowerCase().indexOf('/command2')===0 && console.log('SIP2')
