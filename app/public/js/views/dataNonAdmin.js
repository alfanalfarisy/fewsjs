var sd = $("#startDate").val(moment(oldDps.dt).format('YYYY-MM-DD'));
var ed = $("#endDate").val(moment(newDps.dt).format('YYYY-MM-DD'));
var vs = $("#valueStart").val('0');
var ve = $("#valueEnd").val('999');
var vc = $("#valueChoose").val('tma')

$('#startDate').attr({'min':moment(oldDps.dt).format("YYYY-MM-DD"),'max':moment(newDps.dt).format("YYYY-MM-DD")})
$('#endDate').attr({'min':moment(oldDps.dt).format("YYYY-MM-DD"),'max':moment(newDps.dt).add(1,'days').format("YYYY-MM-DD")})

function kodest(kodeSite){
    var st;
    dataSite.forEach((data)=>{
        if(data.site==kodeSite){
            st = data.pos 
        }
    })
    return st
}

plotTblDps(dataDps)
$('#btnSearch').click(function(){
    var ds = $("#startDate").val();
    var de = $("#endDate").val();
    var vs = $("#valueStart").val();
    var ve = $("#valueEnd").val();
    var vc = $("#valueChoose").val();
    var site = $("#siteChoose").val();
    socket.emit('reqSearch',{ds:ds,de:de,vs:vs,vc:vc,ve:ve,site:site,id:socket.id})
    loadReq()
    
})            
socket.on('dataDpsReq',function(msg){
    if(msg.resp.length==0){
        alert("Data DPS tidak ditemukan!");
    }
    if(msg!='connected'){
        dataDps=msg.resp
    }

    plotTblDps(dataDps)
    succReq()
})