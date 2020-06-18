$('#dateReq').attr({'min':moment(oldDps.dt).format("YYYY-MM-DD"),'max':moment(newDps.dt).format("YYYY-MM-DD")})

var date = $('#dateReq').val();
var optSite = $('#optSite').val();
socket.emit('beranda',{status:'connect',date:date,site:optSite});
$('#siteNameCok').text('KEDUNGGUPIT');
tabell(datas['331'],250,150,80,'KEDUNGGUPIT');
socket.on('berandaData',function(msg){
    succReq()
    var stMd=msg.stMd;
    var optSite = $('#optSite').val();
    if(msg.data.dataRes.length==0){
        alert("Data tidak ditemukan!");
    }else{
        var dataOptSite= siteData.filter((site)=>{return site.site==optSite})[0]    
        tabell(msg.data.dataRes,dataOptSite.th[0],dataOptSite.th[1],dataOptSite.th[2],dataOptSite.pos.toUpperCase());
    }
    socket.emit('beranda',{status:'connect',date:date,site:optSite})
    
})
$('#getBtn').click(function(){
    loadReq()
    var date = $('#dateReq').val();
    var optSite = $('#optSite').val();
    socket.emit('beranda',{date:date,site:optSite,status:'req'})
})


//Panel Last Data Table
socket.on('newestDps',(data)=>{

    var dataNewestDps=data.newestDps
    var siteData=data.siteData
    

    plot(siteData,dataNewestDps)
    siteData.forEach((data)=>{
        var x = dataNewestDps.filter((x)=>{return x.site==data.site})[0]
        $(`#${data.site}`).html(': '+statusTma(x.tma[0],data.th[0],data.th[1],data.th[2]))
    })

    $('#dtUpdate').text(': '+dataNewestDps[0].dt.substring(0,16))
    

    $('#plotTabel').html(plotTabelLast(dataNewestDps,siteData))
})

