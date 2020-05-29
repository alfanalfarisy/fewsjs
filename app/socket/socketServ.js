var siteCode = [221,222,223,331]    
const DpsMain = require('../models/dpsMain');
const DataSite = require('../models/dataprofilessite');
const DpcdMain = require('../models/dpcdMain');

var NewestDps = function socketNewestDps(socket){
    function queryFunction(site){
        return [{ '$match' : {'site':site}},{ '$sort' : {'_id' : -1}},{ '$limit' : 1}]
    }
    function queryAllSite(){
        newQuery={}
        siteCode.forEach((st)=>{
            newQuery[st]=queryFunction(st)
        })
        return newQuery
    }
    Promise.all([
        DpsMain.aggregate([{$facet : queryAllSite()}]),
        DataSite.find({})
    ]).then(result=>{
        [lastUpdate,site]=result;
        
        changeLastUpdateDpsfn = ()=>{
            var a = []
            siteCode.forEach((st)=>{
                x = lastUpdate.map(x=>x[st])
                a.push(x[0][0])
            })
            return a
        }

        data={
            newestDps : changeLastUpdateDpsfn(),
            siteData : site
        }

        socket.emit('newestDps',data)		
    
    }).catch(err=>console.log(err))
}

var SttsValid=(socket)=>{
    socket.on('sttsValid',(msg)=>{
        Promise.all([
            DpsMain.findOne({'tma.1':1000}).sort({'_id': -1}).lean(),
            DpsMain.findOne({'vair.1':1000}).sort({'_id': -1}).lean(),
            DpsMain.findOne({'ch.1':1000}).sort({'_id': -1}).lean(),
        ]).then(result=>{
            [tma,vair,ch]=result
            sttsData={
                'tma' : tma,
                'vair' : vair,
                'ch' : ch
            }
            socket.emit('sttsValidData',sttsData)
        })
    })	
}

var AllDpcd = (socket)=>{
    Promise.all([
        DpcdMain.find({site:221}).sort({'_id': -1}),		
        DpcdMain.find({site:222}).sort({'_id': -1}),		
        DpcdMain.find({site:223}).sort({'_id': -1}),
        DpcdMain.find({site:331}).sort({'_id': -1})
    ]).then(result=>{
        const [ktlmp,dpk,mgr,wwr]=result;
        
        var data={
            '221' : ktlmp,
            '222' : dpk,
            '223' : mgr,
            '331' : wwr,
        }

        socket.emit('DataDpcd',data)
    })
}

module.exports.newestDps = NewestDps; 
module.exports.sttsValid = SttsValid; 
module.exports.allDpcd = AllDpcd; 