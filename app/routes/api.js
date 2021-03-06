var express = require ('express')
var mongoose = require('mongoose');
var router = express.Router();
const DpsMain = require('../models/dpsMain');
const Users = require('../models/users');
const DpcdMain = require('../models/dpcdMain');
const Site = require('../models/dataprofilessite');
var moment = require('moment');

	router.get('/allsite1', function(req, res, next) {
		Promise.all([
		  DpsMain.findOne({site:221}).sort({'dt': -1}),
		  DpsMain.findOne({site:222}).sort({'dt': -1}),
		  DpsMain.findOne({site:223}).sort({'dt': -1}),

		])
		.then(results=>{
			const [ktlmp,dpk,mgr,stMetaData] = results;
			res.send({ktlmp,dpk,mgr,stMetaData})

		})
		.catch(err=>{
		  console.error("Something went wrong",err);
		})
    })
    
    router.get('/site',(req,res,next)=>{
        Site.find({},(err,results)=>{
            res.send(results)
        })
    })

	router.get('/manipulasi',function(req,res,next){
		var date = new Date('2019-12-01');
		// console.log(date)
		var dateM=moment('2020-06-10')
		var dt=[];
		for(i=0; i<1263; i++){
			rand=Math.floor(Math.random() * 200) + 50
			dbt=Math.floor(Math.random() * 50) + 20
			ch=Math.floor(Math.random() * 30) + 0
			// date.setMinutes(date.getMinutes() + 10)
			// dat=date.toISOString()
			dateM = dateM.add(10,'minutes')
			var doc= {
				"dt" : {"$date": new Date(dateM)},
				"site" :331,
				"tma" : [rand,1000], 	
				"vair" : [dbt,1000], 	
				"ch" : [ch,1000] 	
			}

			dt.push(doc)
		}
		res.send(dt)
	})


    module.exports = router;