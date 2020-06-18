siteOpt = 221
var layout = {
    title: "Data Pengamatan ",
    showlegend: true,
    xaxis: {
        showgrid: true,
        zeroline: true,
        showline: false,
        mirror: "ticks",
        gridcolor: "#bdbdbd",
        gridwidth: 2,
        zerolinecolor: "#969696",
        zerolinewidth: 4,
        linecolor: "#636363",
        linewidth: 6
        },
};
vpr=[]; vbr=[];  vrl=[]; x=[];
ipr=[]; ibr=[];  irl=[]; x=[];
vPlot=[
    {"type" : "line","name" : "V PR","y":vpr,"x":x },
    {"type" : "line","name" : "V BR","y":vbr,"x":x },
    {"type" : "line","name" : "V RL","y":vrl,"x":x }]
iPlot=[
    {"type" : "line","name" : "V PR","y":ipr,"x":x },
    {"type" : "line","name" : "V BR","y":ibr,"x":x },
    {"type" : "line","name" : "V RL","y":irl,"x":x }]

var kond	
var kondData = (kond)=>{
    return kond==1000 ? 'valid' :
    kond==1001 ? 'Null' :
    kond==1002 ? 'Error' :
    'Empty'
}

socket.on('DataDpcd',(msg)=>{

    var dpcdKtlmp=msg[siteOpt][0]
    // var dpcdDpk=msg['222'][0]
    // var dpcdMgr=msg['223'][0]
    // var dpcdWwr=msg['331'][0]
    console.log(dpcdKtlmp.dt)
    console.log(dpcdDpk.dt)
        //dt DPCD
        $('.dtDpcdKtlmp').text(dpcdKtlmp.dt)
        $('.dtDpcdDpk').text(dpcdDpk.dt)
        $('.dtDpcdMgr').text(dpcdMgr.dt)
        $('.dtDpcdWwr').text(dpcdWwr.dt)
        //vbr
        // $('.vKtlmp').text(dpcdKtlmp.vbr[0])
        // $('.vDpk').text(dpcdDpk.vbr[0])
        // $('.vMgr').text(dpcdMgr.vbr[0])
        // $('.vWwr').text(dpcdWwr.vbr[0])
        // //estimasi
        // $('.eDKtlmp').text(dpcdKtlmp.vbr[0])
        // $('.eDDpk').text(dpcdDpk.vbr[0])
        // $('.eDMgr').text(dpcdMgr.vbr[0])
        // $('.eDWwr').text(dpcdWwr.vbr[0])
        // //sttus
        // $('.sCKtlmp').text(dpcdKtlmp.stc)
        // $('.sCDpk').text(dpcdDpk.stc)
        // $('.sCMgr').text(dpcdMgr.stc)
        // $('.sCWwr').text(dpcdWwr.stc)
})

socket.on('newestDps',(msg)=>{
    var dataNewestDps=msg.newestDps
    var dpsKtlmp=dataNewestDps.filter(x=>x.site==siteOpt)[0]
    // var dpsDpk=dataNewestDps.filter(x=>x.site==222)[0]
    // var dpsWwr=dataNewestDps.filter(x=>x.site==223)[0]
    // var dpsMgr=dataNewestDps.filter(x=>x.site==331)[0]
    
    //dt
    $('.dtDpsKtlmp').text(dpsKtlmp.dt)
    // $('.dtDpsDpk').text(dpsDpk.dt)
    // $('.dtDpsMgr').text(dpsMgr.dt)
    // $('.dtDpsWwr').text(dpsWwr.dt)

    //tma Kond
    $('.KondTmaKtlmp').text(kondData(dpsKtlmp.tma[1]))
    // $('.KondTmaDpk').text(kondData(dpsDpk.tma[1]))
    // $('.KondTmaMgr').text(kondData(dpsMgr.tma[1]))
    // $('.KondTmaWwr').text(kondData(dpsWwr.tma[1]))
    //vair kon
    $('.KondVKtlmp').text(kondData(dpsKtlmp.vair[1]))
    // $('.KondVDpk').text(kondData(dpsDpk.vair[1]))
    // $('.KondVMgr').text(kondData(dpsMgr.vair[1]))
    // $('.KondVWwr').text(kondData(dpsWwr.vair[1]))
    //ch kond
    $('.KondChKtlmp').text(kondData(dpsKtlmp.ch[1]))
    // $('.KondChDpk').text(kondData(dpsDpk.ch[1]))
    // $('.KondChMgr').text(kondData(dpsMgr.ch[1]))
    // $('.KondChWwr').text(kondData(dpsWwr.ch[1]))
    //VALUE tma
    $('.tmaKtlmp').text(dpsKtlmp.tma[0])
    // $('.tmaDpk').text(dpsDpk.tma[0])
    // $('.tmaMgr').text(dpsMgr.tma[0])
    // $('.tmaWwr').text(dpsWwr.tma[0])
    //vair VALUE
    $('.vKtlmp').text(dpsKtlmp.vair[0])
    // $('.vDpk').text(dpsDpk.vair[0])
    // $('.vMgr').text(dpsMgr.vair[0])
    // $('.vWwr').text(dpsWwr.vair[0])
    //ch VALUE
    $('.chKtlmp').text(dpsKtlmp.ch[0])
    // $('.chDpk').text(dpsDpk.ch[0])
    // $('.chMgr').text(dpsMgr.ch[0])
    // $('.chWwr').text(dpsWwr.ch[0])

})

socket.on('DataDpcd',(dpcd)=>{
    function chart(site){
        vpr=[]; vbr=[];  vrl=[]; x=[];
        ipr=[]; ibr=[];  irl=[]; x=[];
        vPlot=[
            {"type" : "line","name" : "V PR","y":vpr,"x":x },
            {"type" : "line","name" : "V BR","y":vbr,"x":x },
            {"type" : "line","name" : "V RL","y":vrl,"x":x }]
        iPlot=[
            {"type" : "line","name" : "I PR","y":ipr,"x":x },
            {"type" : "line","name" : "I BR","y":ibr,"x":x },
            {"type" : "line","name" : "I RL","y":irl,"x":x }]


        data = dpcd[site];

        data.forEach((data)=>{
            vbr.push(data.vbr[0])
            vpr.push(data.vpr[0])
            vrl.push(data.vrl[0])
            ibr.push(data.ibr[0])
            ipr.push(data.ipr[0])
            irl.push(data.irl[0])
            x.push(data.dt)
        })
        Plotly.newPlot('vChart', vPlot, layout,{responsive: true});
        Plotly.newPlot('iChart', iPlot, layout,{responsive: true});
    }
    function lastrecord(site){
        data=dpcd[site][0]
        $('.dt').text(data.dt)
        $('.lx').text(data.lx[0])
        $('.t').text(data.t[0])
        $('.vpr').text(data.vpr[0])
        $('.vbr').text(data.vbr[0])
        $('.vrl').text(data.vrl[0])
        $('.ipr').text(data.ipr[0])
        $('.ibr').text(data.ibr[0])
        $('.irl').text(data.irl[0])
    }

    chart(221);
    lastrecord(221);
    $('#optionChartKtlmp').click(()=>{
        chart(221)
        lastrecord(221);
    })
    $('#optionChartDpk').click(()=>{
        chart(222)
        lastrecord(222);
    })
    $('#optionChartMgr').click(()=>{
        chart(223)
        lastrecord(223);
    })
    $('#optionChartWwr').click(()=>{
        chart(331)
        lastrecord(331);
    })

})