statusTma = (tma,siaga1,siaga2,siaga3)=>{
    return tma>siaga1 ? 'Siaga 1' : 
    tma>siaga2&&tma<=siaga1 ? 'Siaga 2' :
    tma>siaga3&&tma<=siaga2 ? 'Siaga 3' :
    tma>0&&tma<=siaga3 ? 'Siaga 4' :
    'Error'
}

bgTma = (tma,siaga1,siaga2,siaga3)=> {
    return tma>siaga1  ? '#e84941' 
    : tma>siaga2&&tma<=siaga1 ? '#e8b158' 
    : tma>siaga3&&tma<=siaga2 ?'yellow'
    : '#abeb34'
}


ich=(data)=>{
    ichVal =  data[0].ch[0]-data[5].ch[0]
    return Math.sign(ichVal)=='-1' ? 0 : ichVal      
}

statusIch =(ich)=>{
    return ich<0 ? 'Error' :
    ich==0 ? 'Tidak Hujan' : 
    ich>0&&ich<=5 ? 'Hujan Ringan' :
    ich>5&&ich<=10 ? 'Hujan Sedang' :
    ich>10&&ich<=20 ? 'Hujan Lebat' :
    'Hujan Sangat Lebat' 
}

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

// function allTma(dataRes){
//     siteId=[221,222,223,331];
//     tmaKtlmp=[];tmaDpk=[];tmaMgr=[];tmaWwr=[];x=[];

//     siteId.forEach((siteId)=>{
//         dataRes[siteId].forEach((data)=>{
//             push = ()=>{
//                 siteId==221 ? tmaKtlmp.push(data.tma[0]) :
//                 siteId==222 ? tmaDpk.push(data.tma[0]) :
//                 siteId==331 ? tmaWwr.push(data.tma[0]) :
//                 tmaMgr.push(data.tma[0])
//             }
//             if(siteId==221) {x.push(data.dt)} 
//             push()
//         })
//     })

//     tmaPlot=[
//     {"type" : "line","name" : "Katulampa","y":tmaKtlmp,"x":x },
//     {"type" : "line","name" : "Depok","y":tmaDpk,"x":x },
//     {"type" : "line","name" : "Manggarai","y":tmaMgr,"x":x },
//     {"type" : "line","name" : "Wawar","y":tmaWwr,"x":x }]
//     Plotly.newPlot('chart', tmaPlot, layout,{responsive: true});
// }
