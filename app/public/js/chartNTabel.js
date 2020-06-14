var layout = {
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
function plotTabelLast(dataNewest,siteData){
    var x='';
    dataNewest.forEach((data)=>{
        sd = siteData.filter((x)=>{return x.site==data.site})[0]
        bg = bgTma(data.tma[0],sd.th[0],sd.th[1],sd.th[2])
        x += `<tr>
            <td>${sd.pos}</td>
            <td>${data.dt.substring(0,16)}</td>
            <td>${data.tma[0]}</td>
            <td>${data.vair[0]}</td>
            <td>${data.ch[0]}</td>
        </tr>`
    })
    return x
}

function tabell(dataRes,siaga1,siaga2,siaga3,namePos){
    tma=[]; vair=[]; ch=[]; x=[];
    dPlot=[
    {"type" : "line","name" : "tma","y":tma,"x":x },
    {"type" : "line","name" : "vair","y":vair,"x":x },
    {"type" : "line","name" : "ch","y":ch,"x":x }]

    $(".remove").remove();
    var tmaTbl='';
    var vairTbl='';
    var chTbl='';
    var timeTbl='';
    dataRes.forEach(function(data){
        var tmaTemp = data.tma[0]                
        var kodeToSt = (siaga1,siaga2,siaga3)=> {
            return tmaTemp>siaga1  ? '#e84941' 
            : tmaTemp>siaga2&&tmaTemp<=siaga1 ? '#e8b158' 
            : tmaTemp>siaga3&&tmaTemp<=siaga2 ?'yellow'
            : tmaTemp<0?'grey'
            : '#abeb34'
        }
        bg = kodeToSt(siaga1,siaga2,siaga3)


        date=data.dt.substring(0,10)
        time=data.dt.substring(11,16)

        dt=date+" "+time
        tmaTbl+="<td style='background-color:"+bg+"' class='remove'>"+data.tma[0]+"</td>"
        vairTbl+="<td class='remove'>"+data.vair[0]+"</td>"
        chTbl+="<td class='remove'>"+data.ch[0]+"</td>"
        timeTbl+="<th class='remove'>"+time+"</th>"

        tma.push(data.tma[0])
        vair.push(data.vair[0])
        ch.push(data.ch[0])
        var dt;
        x.push(dt)
    })

    dt=dataRes[0].dt.substring(0,10)
    title= 'Data Pengamatan\n' + dt
    layout={...layout,title}
    Plotly.newPlot('chart', dPlot, layout,{responsive: true});
    $(".tma").after(tmaTbl);
    $(".vair").after(vairTbl);
    $(".ch").after(chTbl);
    $(".dt").after(timeTbl);
    $('#siteName').text(namePos)
    $('#siteNameCok').text(namePos)
    
}

function allTma(dataRes){
    siteId=[221,222,223,331];
    tmaKtlmp=[];tmaDpk=[];tmaMgr=[];tmaWwr=[];x=[];

    siteId.forEach((siteId)=>{
        dataRes[siteId].forEach((data)=>{
            push = ()=>{
                siteId==221 ? tmaKtlmp.push(data.tma[0]) :
                siteId==222 ? tmaDpk.push(data.tma[0]) :
                siteId==331 ? tmaWwr.push(data.tma[0]) :
                tmaMgr.push(data.tma[0])
            }
            if(siteId==221) {x.push(data.dt)} 
            push()
        })
    })

    tmaPlot=[
    {"type" : "line","name" : "Katulampa","y":tmaKtlmp,"x":x },
    {"type" : "line","name" : "Depok","y":tmaDpk,"x":x },
    {"type" : "line","name" : "Manggarai","y":tmaMgr,"x":x },
    {"type" : "line","name" : "Wawar","y":tmaWwr,"x":x }]
    Plotly.newPlot('chart', tmaPlot, layout,{responsive: true});
}