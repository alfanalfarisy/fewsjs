var sd = $("#startDate").val(moment(oldDps.dt).format('YYYY-MM-DD'));
var ed = $("#endDate").val(moment(newDps.dt).format('YYYY-MM-DD'));
var vs = $("#valueStart").val('0');
var ve = $("#valueEnd").val('999');
var vc = $("#valueChoose").val('tma')

$('#startDate').attr({'min':moment(oldDps.dt).format("YYYY-MM-DD"),'max':moment(newDps.dt).format("YYYY-MM-DD")})
$('#endDate').attr({'min':moment(oldDps.dt).format("YYYY-MM-DD"),'max':moment(newDps.dt).add(1,'days').format("YYYY-MM-DD")})
$('#startDateDpcd').attr({'min':moment(oldDpcd.dt).format("YYYY-MM-DD"),'max':moment(newDpcd.dt).format("YYYY-MM-DD")})
$('#endDateDpcd').attr({'min':moment(oldDpcd.dt).format("YYYY-MM-DD"),'max':moment(newDpcd.dt).add(1,'days').format("YYYY-MM-DD")})

function save(){
    dataSave = {
        site : $('#inputSite').val(),
        dt : `${$('#inputDate').val()}T${$('#inputTime').val()}`,
        tma : $('#inputTma').val()
    }

    socket.emit('saveNewDataDps',dataSave)
    console.log(dataSave)
}

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
// plotTblDpsTemp(dataDpsTemp)
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
    console.log(msg)
    succReq()
    if(msg.resp.length==0){
        alert("Data DPS tidak ditemukan!");
    }
    if(msg!='connected'){
        dataDps=msg.resp
    }

    plotTblDps(dataDps)

})


$('#btnSearchDpcd').click(function(){
    var ds = $("#startDateDpcd").val();
    var de = $("#endDateDpcd").val();
    socket.emit('reqSearchDpcd',{ds:ds,de:de,id:socket.id})

})
socket.on('DataDpcd',(data)=>{
    array=[data['221'],data['222'],data['223'],data['331']]
    var data = [].concat.apply([], array)
    
    plotTblDpcd(data)
})

socket.on('dataDpcdReq',(data)=>{
    if(data.resp.length==0){
        alert("Data DPCD tidak ditemukan!");
    }
    plotTblDpcd(data.resp)

})