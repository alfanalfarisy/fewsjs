var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
//models
const DpsMain = require('../models/dpsMain');
const DpsMainTes = require('../models/dpsMainTes');
const Users = require('../models/users');
const DpcdMain = require('../models/dpcdMain');
const DataSite = require('../models/dataprofilessite');
const Subscription = mongoose.model('Subscribers');
const DpsMainStream = DpsMainTes.watch();
//mqtt
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://broker.mqttdashboard.com')
//
const SocketServ = require('../socket/socketServ');


const moment = require('moment');
const q = require('q');
const webPush = require('web-push');
const keys = require('../config/keys');



function socket(io){

	// mqtt
	client.subscribe('cokcokcok');
	client.on('message', mqtt_messsageReceived);
	function mqtt_messsageReceived(topic, message, packet) {
		var data=message.toString();
	}

   	io.on('connection', function(socket){

		console.log('a user connected');
		var start = new Date('2019-12-07');
		var end = new Date('2019-12-07');
		end.setDate(end.getDate() + 1);
		var stBeranda=221

		SocketServ.newestDps(socket)		
		SocketServ.sttsValid(socket)		
		SocketServ.allDpcd(socket)		
		

		//Qc
		socket.on('addUser',(data)=>{
			// console.log('new data')
			Users.find({username:data.username}, function (err, user){
	            if (user.length == 0)
	            {
	                var admin = new Users({
	                    username: data.username,
	                    password: data.pass,
	                    email: data.email,
	                    no: data.no,
	                    firstname: data.firstname,
	                    lastname: data.lastname,
	                    admin: data.admin
	                });


	                admin.save(function(err) {
						Users.find({},function(err,resp){
							socket.emit('users',{users:resp})
						})
	                });
	            }
	            else
            	{}
			})
		})

		socket.on('delUser',(data)=>{
			Users.deleteOne({username:data},(err,resp)=>{
				Users.find({},function(err,resp){
					socket.emit('users',{users:resp,username:data.username})
				})
			})
		})

		socket.on('editUser',(data)=>{
			console.log('Edit data')
			Users.findOne({username : data.username}, function(err, user){
	            user.username = data.username;
	            user.email = data.email;
	            user.firstname = data.firstname;
	            user.lastname = data.lastname;
	            user.no = data.no;
	            user.password = data.pass;
	            user.admin = data.admin;

				console.log(user)
	            user.save(function(err, user){
					Users.find({},function(err,resp){
						socket.emit('users',{users:resp,username:data.username})
					})
	            });
	        });
		})

		socket.on('getUsers',()=>{
			Users.find({},(err,resp)=>{
				socket.emit('users',{users:resp})
			})

		})
		
		socket.on('editProfile',(data)=>{
			// console.log(data)
			Users.findOne({username : data.username}, function(err, user){
	            user.username = data.username;
	            user.email = data.email;
	            user.firstname = data.firstname;
	            user.lastname = data.lastname;
	            user.no = data.no;
	            user.password = data.pass;
	            user.admin = data.admin;

	            user.save(function(err, user){
					Users.find({'username':user.username},function(err,resp){
						socket.emit('users',resp)
					})
	            });
	        });
		})

		socket.on('dataNewUser',(data)=>{
        	// console.log('admin')
			Users.findOne({username : data.username}, function(err, user){
            
            if (user==null)
            {
				var admin = new Users({
                    username: data.username,
                    password: data.pass,
                    email: data.email,
                    no: data.no,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    admin: false,
                });
                admin.save(function(err) {
                	socket.emit('confirmAcc','acc')
                });
            }
            else
            {
            	socket.emit('confirmAcc','usernameFalse')
            }
	        });
		})

		
		socket.on('beranda', function(msg){
			stBeranda=Number(msg.site)
			var start = new Date(msg.date);
			var end = new Date(msg.date);
			end.setDate(end.getDate() + 1);
			if(msg.status=='connect'){}
			else{
				Promise.all([
					DpsMain.find({site:stBeranda,'dt': {$gte: start, $lt:end}}).sort({'_id': -1}),		
					DataSite.find({site:stBeranda}),	
				])
				.then(result=>{
					const [dataRes,stMd] = result;
					var data={
						'dataRes' : dataRes,
						'stMd' :stMd,
						'site' : Number(stBeranda) 
					}						
					socket.emit('berandaData',{data})						
				})
			}			
		});
		
		DpsMainStream.on('change',(change)=>{
			DpsMain.find({site:stBeranda,'dt': {$gte: start, $lt:end}}).sort({'_id': -1}).exec((err,result)=>{
				// console.log(result)
				var data={
					'dataRes' : result,
					'site' : Number(stBeranda) 
				}
				socket.emit('berandaData',{data})
			})
		})
		
		socket.on('reqSearch', function(msg){
			var socketid=msg.id
			var site=msg.site
			var siteOpt=(site)=>{return site=='all' ? [221,222,223] : [Number(site)]}
			var sc = siteOpt(site)
			console.log(sc)
			var de = new Date(msg.de)
			var ds = new Date(msg.ds)

			DpsMain.find({
				site : {$in : sc},
				[msg.vc]:{$gt: Number(msg.vs), $lt: Number(msg.ve)},		
				dt :{$gt: ds, $lt: de}
				
			},function(err, resp){	
				socket.emit('dataDpsReq',{resp})				
			})

		})

		socket.on('reqSearchDpcd', function(msg){
			var socketid=msg.id
			var de = new Date(msg.de)
			var ds = new Date(msg.ds)

			DpcdMain.find({		
				dt :{$gt: ds, $lt: de}
				
			},function(err, resp){	
				socket.emit('dataDpcdReq',{resp})						
			})

		})

		socket.on('saveNewDataDps',(data)=>{
			DpsMainTes.findOne({},(err,resp)=>{
				var dpsNew = new DpsMainTes({
					site : data.site,
					tma: [data.tma,1004],
					dt: data.dt,
					vair: [-1,1003],
					ch: [-1,1003],
	
				});
				dpsNew.save(function(err) {
					console.log(err)
				});
			})
		})

		socket.on('publishSwitch',function(msg){
			client.publish('switch', '1')
		})
		socket.on('publishWarning',function(data){
			var msg=[data.siteOpt,data.statusOpt,data.ichOpt]
			msg = msg.toString()
			console.log(msg)
			client.publish('dpsWarning',msg)
		})

		socket.on('meanDps',(msg)=>{
			io.emit('decisionOn', {});
			console.log('decision ON')
		})
		socket.on('floodDecision',(msg)=>{
			console.log('Diseminasi ON')
			var data = msg;
			io.emit('diseminasiOn', {data});
			io.emit('diseminasiOnWeb', {data});

		})
		socket.on('waNotif',(msg)=>{
			console.log(msg)
			io.emit('waDiseminasi',msg)
		})
		socket.on('pushNotif',(msg)=>{
			io.emit('pushNotif',(msg))
		})
		DpsMainStream.on('change', (change) => {
			SocketServ.newestDps(socket)
			SocketServ.sttsValid(socket)
			SocketServ.allDpcd(socket)	
		});
	});

	


}	

module.exports = {
  router: router,
  sck: socket
}