var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var DpsMain = require('../models/dpsMain');
var DataSite = require('../models/dataprofilessite');
var FloodRecord = require('../models/floodRecord');
var Users = require('../models/users');
var Auth_mdw = require('../middlewares/auth');
var moment = require('moment');
const changeStream = DpsMain.watch();
var session_store;
var secret="projek20";

var start = new Date(moment().add(7,'hours').format('YYYY-MM-DD'));
var end = new Date(moment().add(7,'hours').add(1, 'day').format('YYYY-MM-DD')); 

function socket(io){

	router.get('/*', function(req, res, next) {
		var session = req.session;
		res.locals.status= false;
		res.locals.admin= false;
		if(session.logged_in==true){
			res.locals.status= session.logged_in;
			res.locals.username= session.username;
			res.locals.admin= session.admin;

    	}

    	next();
	});

	router.get('/', function(req, res, next) {		
		session_store = req.session;
		title='FEWS | HOME'
		// console.log(start)
		// console.log(end)
				Promise.all([
					DpsMain.find({}).sort({'dt':1}).limit(1),
					DpsMain.find({}).sort({'dt':-1}).limit(1),
					DpsMain.find({site:331,'dt':{$gt:start,$lt:end}}).sort({'dt' : -1}).lean(),
					DpsMain.findOne({site:221,'dt':{$gt:start,$lt:end}}).sort({'dt' : -1}).lean(),
					DpsMain.findOne({site:222,'dt':{$gt:start,$lt:end}}).sort({'dt' : -1}).lean(),
					DpsMain.findOne({site:223,'dt':{$gt:start,$lt:end}}).sort({'dt' : -1}).lean(),
					DpsMain.findOne({site:331,'dt':{$gt:start,$lt:end}}).sort({'dt' : -1}).lean(),
					DataSite.find({})
				])
				.then(results=>{

					var [oldDps,newDps,wwr,ktlmp1,dpk1,mgr1,wwr1,dataSite] = results;
					var data = {
						'oldDps':oldDps[0],
						'newDps':newDps[0],
						'331' : wwr,
						'221one' : ktlmp1,
						'222one' : dpk1,
						'223one' : mgr1,
						'331one' : wwr1,
						'siteData' : dataSite,
						'lastData':[ktlmp1,dpk1,mgr1,wwr1]
					}
					// console.log(data)
					res.render('index',{results:JSON.stringify(data),session_store:session_store,title:title,siteData:dataSite})
					
				})
				.catch(err=>{
				  console.error("Something went wrong",err);
				})
	})
	router.get('/loc', function(req, res, next) {		
		title='FEWS | Loc'
		res.render('loc',{title:title});
	})
	router.get('/cok', function(req, res, next) {		
		title='FEWS | Loc'
		DataSite.find({},(err,resp)=>{
			// console.log(resp)
			res.render('loc',{title:title,siteData:resp});

		})
	})
	router.get('/about', function(req, res, next) {		
		title='FEWS | About'
		res.render('about',{title:title});
	})

	router.get('/weather', function(req, res, next) {
	  title='FEWS | Weather'
	  res.render('weather',{title:title});
	});
	router.get('/warning', function(req, res, next) {
	  title='FEWS | WARNING'
	  FloodRecord.findOne({}).sort({'dt':-1}).lean().exec((err,result)=>{
			// console.log(result)
			res.render('warning',{title:title,data:JSON.stringify(result)});
	  })
	});
	router.get('/data-dps',Auth_mdw.check_login, function(req, res, next) {
	  title='FEWS | Data-Dps'
		Promise.all([
			DpsMain.find({}).sort({'dt':1}).limit(1),
			DpsMain.find({}).sort({'dt':-1}).limit(1),
			DpsMain.find({}),
			DataSite.find({}).lean(),
		]).then(result=>{
			[oldDps,newDps,dps,dataSite]=result;
			data={
				'oldDps':oldDps[0],
				'newDps':newDps[0],
				'dps':dps,
				'dataSite':dataSite
			}
			// console.log(dataSite)
			res.render('dataDps',{title:title,session_store:session_store, results:JSON.stringify(data),dataSite:dataSite});
		})
	});
	
	router.get('/site/:reqsite', function(req, res){
		
		var siteReq = Number(req.params.reqsite);
		title={'221':'KTLMP','222':'DEPOK','223':'MANGGARAI','331' : 'KEDUNGGUPIT'}
		title='FEWS | '+title[siteReq]
		

		Promise.all([
			DpsMain.find({}).sort({'dt':1}).limit(1),
			DpsMain.find({}).sort({'dt':-1}).limit(1),
			DpsMain.find({site:siteReq,'dt':{$gte:start,$lt:end}}).sort({'dt' : -1}).lean(),
			DataSite.find({site:siteReq}),
		])
		.then(results=>{
			var [oldDps,newDps,dasAll,stMd] = results;
			var data = {
				'oldDps':oldDps[0],
				'newDps':newDps[0],
				'dataRes' : dasAll,
				'stMd' : stMd
			}

			res.render('site',{results:JSON.stringify(data),siteReq:siteReq,title:title})
			
		})
		.catch(err=>{
		  console.error("Something went wrong",err);
		})
	});

	

}

module.exports = {
  router: router,
  sck: socket
}

