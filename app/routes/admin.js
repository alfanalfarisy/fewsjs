var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var DpsMain = require('../models/dpsMain');
var DpsTemp = require('../models/dpsTemp');
var DpcdMain = require('../models/dpcdMain');
var DataSite = require('../models/dataprofilessite');
var User = require('../models/users');
var subscribers = require('../models/subscribers');
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
		if(session.logged_in){
		res.locals.session= session.logged_in;
    	}

    	next();
	});


	router.get('/data',Auth_mdw.check_login,Auth_mdw.is_admin,function(req, res, next){
		title='FEWS | Data'
		session_store = req.session;

		Promise.all([
			DpcdMain.find({}).sort({'dt':1}).limit(1),
			DpcdMain.find({}).sort({'dt':-1}).limit(1),
			DpsMain.find({}).sort({'dt':1}).limit(1),
			DpsMain.find({}).sort({'dt':-1}).limit(1),
			DpsMain.find({'dt':{$gt:start,$lt:end}}),
			DpsTemp.find({'dt':{$gt:start,$lt:end}}),
			DataSite.find({}),
		]).then(result=>{
			[oldDpcd,newDpcd,oldDps,newDps,dps,dpsTemp,dataSite]=result;
			data={
				'oldDpcd':oldDpcd[0],
				'newDpcd':newDpcd[0],
				'oldDps':oldDps[0],
				'newDps':newDps[0],
				'dps':dps,
				'dpsTemp':dpsTemp,
				'dataSite':dataSite
			}
			res.render('admin/data',{title:title,session_store:session_store, results:JSON.stringify(data), dataSite:dataSite});
		})

	})

	router.post('/get', Auth_mdw.check_login, function(req, res, next){
		session_store = req.session;
		var dpsMain='';
		// req.assert('valueStart','blbla').notEmpty().withMessage('Wajib di isi bro');
		var errors = req.validationErrors();
		console.log(errors);

		if(!errors)
		{
			var now = moment().format("YYYY-MM-DD")
			v_valueStart=req.sanitize('valueStart').escape().trim();
				if(v_valueStart==''){v_valueStart='0.02'};
			v_valueEnd=req.sanitize('valueEnd').escape().trim();
				if(v_valueEnd==''){v_valueEnd='9999'};
			v_startDate=req.sanitize('startDate').escape().trim();
				if(v_startDate==''){v_startDate='2000-1-1'};
			V_endDate=req.sanitize('endDate').escape().trim();
				if(V_endDate==''){V_endDate=now};
			V_siteChoose=req.sanitize('siteChoose').escape();
				if(V_siteChoose=='all'){V_siteChoose=['sitea','siteb','sitec']};
			V_valueChoose=req.sanitize('valueChoose').escape();
			DpsMain.find({
				stasiun : V_siteChoose,
				tma:{$gt: v_valueStart, $lt: v_valueEnd},		
				Tanggal :{$gt: v_startDate, $lt: V_endDate}
				
			},function(err, dpsMain){	
				res.render('admin/get',{datas:dpsMain,dpsMain:JSON.stringify(dpsMain)})
			})
		}
		else
		{
			errors_detail = "<p>Punten, sepertinya ada salah pengisian, mangga check lagi formnyah!</p><ul>";

			for (i in errors)
			{
				error = errors[i];
				errors_detail += '<li>'+error.msg+'</li>';
			}

			errors_detail += "</ul>";


			req.flash('msg_error', errors_detail);

			res.render('admin/get',{session_store:session_store, datas:data10m});
		}

	})

	router.get('/broadcast',Auth_mdw.check_login, Auth_mdw.is_admin,function(req,res,next){
	// router.get('/control',function(req,res,next){
		title='FEWS | Control'
		res.render('admin/control',{title:title});
	})
	router.get('/qc',Auth_mdw.check_login, Auth_mdw.is_admin,function(req,res,next){
		title='FEWS | QC'
		res.render('admin/qc',{title:title});
	})

}

module.exports = {
  router: router,
  sck: socket
}
