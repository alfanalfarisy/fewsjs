var siteReq = 331

function pos(siteReq){return siteData.filter(x=>{return x.site==siteReq})[0].pos
}

var kond	
var kondData = (kond)=>{
    return kond==1000 ? 'valid' :
    kond==1001 ? 'Null' :
    kond==1002 ? 'Error' :
    'Empty'
}

function chart(site,dpcd){
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
function lastrecord(site,dpcd){
    data=dpcd[site][0]
    $('.site').text(pos(data.site))
    $('.dt').text(data.dt)
    $('.lx').text(data.lx[0])
    $('.t').text(data.t[0])
    $('.wps').text(data.wps[0])
    $('.skb').text(data.skb[0])
    $('.edb').text(data.edb[0])
    $('.inps').text(data.inps[0])
    $('.vpr').text(data.vpr[0])
    $('.vbr').text(data.vbr[0])
    $('.vrl').text(data.vrl[0])
    $('.ipr').text(data.ipr[0])
    $('.ibr').text(data.ibr[0])
    $('.irl').text(data.irl[0])
}

function updateDps(data,siteReq){
        var dps=data.filter(x=>x.site==siteReq)[0]
        $('.siteDps').text(pos(dps.site))
        $('.dtDps').text(dps.dt)
        $('.KondTma').text(kondData(dps.tma[1]))
        $('.KondV').text(kondData(dps.vair[1]))
        $('.KondCh').text(kondData(dps.ch[1]))
        $('.tma').text(dps.tma[0])
        $('.vair').text(dps.vair[0])
        $('.ch').text(dps.ch[0])
    }

socket.on('newestDps',(msg)=>{
    var data=msg.newestDps
    updateDps(data,siteReq)
    
    $('#getBtn').click(()=>{
        updateDps(data,$('#optSite').val())
    })

})


function tbl(data){
    var tbl;
    data.forEach(data=>{
        tbl+= `<tr class='remove'>
                    <td>${pos(data.site)}</td>
                    <td>${data.dt}</td>
                    <td>${data.lx[0]}</td>
                    <td>${data.t[0]}</td>
                    <td>${data.skb[0]}</td>
                    <td>${data.edb[0]}</td>
                    <td>${data.wps[0]}</td>
                    <td>${data.inps[0]}</td>
                    <td>${data.vbr[0]}</td>
                    <td>${data.vpr[0]}</td>
                    <td>${data.vrl[0]}</td>
                    <td>${data.ibr[0]}</td>
                    <td>${data.ipr[0]}</td>
                    <td>${data.irl[0]}</td>
                </tr>`
    })
    return tbl
}

socket.on('DataDpcd',(dpcd)=>{
    succReq()
    $('.remove').remove()
    $('#tblContent').after(tbl(dpcd[siteReq]))
    if(dpcd[siteReq].length>0){
        chart(siteReq,dpcd);
        lastrecord(siteReq,dpcd);
    }else{
        alert('Data Kosong')
    }
})

    $('#getBtn').click(()=>{
        loadReq()
        siteReq= $('#optSite').val()
        socket.emit('dpcdReq',{date:$('#dateReq').val(),site:siteReq})
    })