$("#btnSend").click(function(){
    var valid = $("#validasi").val()
    console.log(valid)
    if(valid=='12345'){
        socket.emit('publish','SEND')
        alert('PUBLISHED!')
    }
})

function notifCustom(notif){
    dataCustom={
    'type'	: 'custom',
    'msgTitle' : $('#msgTitle').val(),
    'msgPayload' : $('#msgPayload').val()
    }
    if(dataCustom.msgTitle==''||dataCustom.msgPayload==''){
        alert('Form tidak boleh kosong!')
    }else{
        socket.emit(notif,dataCustom)
    }			
}

$('#btnPushCustom').click(()=>{
    notifCustom('pushNotif')
})
$('#btnWaCustom').click(()=>{
    notifCustom('waNotif')
})
function fncDataInput(){
    dataInput={
        'siteOpt' : $('#siteOpt').val(),
        'ichOpt' : $('#ichOpt').val(),
        'statusOpt' : $('#statusOpt').val(),
        'inputTma' : $('#inputTma').val(),
        'inputIch' : $('#inputIch').val()
    }
}
$('#btnPushDefault').click(()=>{
    fncDataInput()
    msgPayload = {
                'pos': dataInput.siteOpt, 
                'status': dataInput.statusOpt,
                'kondisi': dataInput.ichOpt,
                'tma' : dataInput.inputTma,
                'ich': dataInput.inputIch}
    data={
        'msgPayload' : msgPayload
    }
    if(dataInput.inputTma==''||dataInput.inputIch==''){
        alert('Form tidak boleh kosong!')
        $('#inputIch').css('background', '#ffdddd');
        $('#inputIch').css('background', '#ffdddd');
    }else{
        socket.emit('pushNotif',data)
        alert('Broadcast Success!')
        dataInput=''
    }

})
$('#btnWaDefault').click(()=>{
    fncDataInput()
    title = 'Warning'
    msgPayload = {
                'pos': dataInput.siteOpt, 
                'status': dataInput.statusOpt,
                'kondisi': dataInput.ichOpt,
                'tma' : dataInput.inputTma,
                'ich': dataInput.inputIch}
    dataDefault={
        'type'	: 'default',
        'msgTitle' : title,
        'msgPayload' : msgPayload
    }
    dataInput.inputTma=='' || dataInput.inputIch=='' ? 
    alert('form kosong') : 
    socket.emit('waNotif',dataDefault),
    alert('Broadcast Success!')

})
$('#btnPublishDefault').click(()=>{
    socket.emit('publishWarning',dataInput)
    console.log(dataInput)
})

$('#inputTma').change(()=>{
    console.log($('#inputTma').val())
})

