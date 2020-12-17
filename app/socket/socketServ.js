var siteCode = [221,222,223,331]    
const DpsMain = require('../models/dpsMain');
const DataSite = require('../models/dataprofilessite');
const DpcdMain = require('../models/dpcdMain');

var NewestDps = function socketNewestDps(socket){
    function queryFunction(site){
        return [{ '$match' : {'site':site}},{ '$sort' : {'dt' : -1}},{ '$limit' : 1}]
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
        stSite = msg.siteReq
        Promise.all([
            DpsMain.findOne({'site':stSite,'tma.1':1000}).sort({'dt': -1}).lean(),
            DpsMain.findOne({'site':stSite,'vair.1':1000}).sort({'dt': -1}).lean(),
            DpsMain.findOne({'site':stSite,'ch.1':1000}).sort({'dt': -1}).lean(),
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

var AllDpcd = (socket,site,start,end)=>{
    Promise.all([
        // DpcdMain.find({'site':site}).sort({'_id': -1}), 
        DpcdMain.find({site:site,'dt':{$gte:start,$lte:end}}).sort({'dt': -1}), 
    ]).then(result=>{
        const [resp]=result;
        
        var data={
            [site] : resp,
        }
        // console.log(data)
        socket.emit('DataDpcd',data)
    })
}

module.exports.newestDps = NewestDps; 
module.exports.sttsValid = SttsValid; 
module.exports.allDpcd = AllDpcd; 