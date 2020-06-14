$('#dateReq').attr({'min':moment(oldDps.dt).format("YYYY-MM-DD"),'max':moment(newDps.dt).format("YYYY-MM-DD")})

var date = $('#dateReq').val();
socket.emit('beranda',{date:date,site:siteReq,status:'connect'})

function lastrecord(dataRes){
	$("#postma").html(dataRes[0].tma[0]);
	$("#posvair").html(dataRes[0].vair[0]);
	$("#posch").html(dataRes[0].ch[0]);
}

socket.emit('sttsValid',{status:'connect',siteReq:siteReq})

var sttsTma = statusTma(dataRes[0].tma[0],stMd.th[0],stMd.th[1],stMd.th[2])
var ichVal = ich(dataRes)
var sttsIch = statusIch(ichVal)

$('#sttsIch').text(sttsIch)
$('#sttsTma').text(sttsTma)
$('#nilaiIch').text(ichVal+'mm (1 jam terkahir)')
$('#siteName').text(stMd.pos.toUpperCase())


tabell(dataRes,stMd.th[0],stMd.th[1],stMd.th[2])
lastrecord(dataRes)
plotMap(stMd.pos,siteReq,stMd.lat,stMd.long,dataRes[0].tma[0],dataRes[0].vair[0],dataRes[0].ch[0],greenIcon)

socket.on('berandaData',function(msg){
	succReq()
	dataRes = msg.data.dataRes
	lastrecord(dataRes)
	tabell(dataRes,stMd.th[0],stMd.th[1],stMd.th[2])

	plotMap(stMd.pos,siteReq,stMd.lat,stMd.long,dataRes[0].tma[0],dataRes[0].vair[0],dataRes[0].ch[0],greenIcon)
	
	var sttsTma = statusTma(dataRes[0].tma[0],stMd.th[0],stMd.th[1],stMd.th[2])
	var ichVal = ich(dataRes)
	var sttsIch = statusIch(ichVal)
	$('#sttsIch').text(sttsIch)
	$('#sttsTma').text(sttsTma)
	$('#nilaiIch').text(ichVal+'mm (1 jam terkahir)')
	$('#siteName').text(stMd.pos.toUpperCase())			

	socket.emit('beranda',{date:date,site:siteReq,status:'connect'})
	

})

$('#getBtn').click(function(){
	var date = $('#dateReq').val();
	socket.emit('beranda',{date:date,site:siteReq,status:'req'})
	loadReq()
})

socket.on('sttsValidData',(msg)=>{
	$('#tmaDate').text(msg.tma.dt)
	$('#chDate').text(msg.ch.dt)
	$('#vairDate').text(msg.vair.dt)
})