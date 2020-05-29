function plotTblDpcd(datasDpcd){
    var dataSet = [];
    datasDpcd.forEach(function(data){     

        st=kodest(data.site)
        dt=data.dt;
        lx=data.lx[0]
        t=data.t[0]
        stc=data.stc
        vpr=data.vpr[0]
        vrb=data.vrb[0]
        vbr=data.vbr[0]
        vrl=data.vrl[0]
        ipr=data.ipr[0]
        irb=data.irb[0]
        ibr=data.ibr[0]
        irl=data.irl[0]
        dataSet.push([st,dt,lx,t,stc,vpr,vrb,vbr,vrl,ipr,irb,ibr,irl]);
        })

    $('.dataTableDpcd').DataTable( {
        data: dataSet,
        destroy: true,
        dom: 'Bfrtip',
        responsive: true,
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ],
        scrollX: true,
        scrollY: true,
        columns: [
            { title: "Site" },
            { title: "Dt" },
            { title: "lx" },
            { title: "t" },
            { title: "stc" },
            { title: "vpr" },
            { title: "vrb" },
            { title: "vbr" },
            { title: "vrl" },
            { title: "ipr" },
            { title: "irb" },
            { title: "ibr" },
            { title: "irl" }

        ],
    } );

}
function plotTblDps(datasDps){
    var dataSet = [];
    datasDps.forEach(function(data){     

        st = kodest(data.site)

        dataSet.push([st,data.dt,data.tma[0],data.ch[0],data.vair[0]]);
        })

    $('.dataTable').DataTable( {
        data: dataSet,
        destroy: true,
        responsive: true,
        scrollX: true,
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ],
        scrollY: true,
        columns: [
            { title: "Site" },
            { title: "Tanggal" },
            { title: "tma" },
            { title: "laju" },
            { title: "ch" }
        ],
    } );

}

var mymap = L.map('mapid',{ zoomControl: false }).setView([-6.917664, 108.506349], 7);
function mergeSiteLastData(siteDatas,lastDataSites){
    arr=[]
    siteDatas.forEach((siteData)=>{
        lastDataSites.forEach((lastData)=>{
            if(siteData.site==lastData.site){ 
            x = Object.assign(siteData, lastData);
            arr.push(x)
            //- console.table(x)
            }
        })
    })
    return arr;
}



var redIcon = new L.Icon({
	iconUrl: '/images/iconLeaflet/marker-icon-2x-red.png',
	shadowUrl: '/images/iconLeaflet/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var greenIcon = new L.Icon({
	iconUrl: '/images/iconLeaflet/marker-icon-2x-green.png',
	shadowUrl: '/images/iconLeaflet/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var orangeIcon = new L.Icon({
	iconUrl: '/images/iconLeaflet/marker-icon-2x-orange.png',
	shadowUrl: '/images/iconLeaflet/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var yellowIcon = new L.Icon({
	iconUrl: '/images/iconLeaflet/marker-icon-2x-yellow.png',
	shadowUrl: '/images/iconLeaflet/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var blackIcon = new L.Icon({
	iconUrl: '/images/iconLeaflet/marker-icon-2x-black.png',
	shadowUrl: '/images/iconLeaflet/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

iconForTma = (tma,siaga1,siaga2,siaga3)=>{
    return tma>siaga1 ? redIcon : 
    tma>siaga2&&tma<=siaga1 ? orangeIcon :
    tma>siaga3&&tma<=siaga2 ? yellowIcon :
    tma>0&&tma<=siaga3 ? greenIcon :
    blackIcon
}
function plotMap(pos,site,lat,long,tma,vair,ch,colorIcon){
    
    var pos = L.marker([lat, long],{icon: colorIcon}).addTo(mymap);
        pos.bindPopup((layer)=>{
            var el = document.createElement('div');
            el.classList.add("my-class");
                el.innerHTML = 
                'LOC : ' + site +
                '<br>TMA : ' +  tma + 
                '<br>FLOW : ' + vair + 
                '<br>CH : ' + ch +
                '<br><a href='+BASE_URL+'/site/'+site+'>Detail</a>';
            
            return el;
        });
}

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', 
{
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoicHJvamVrMjAiLCJhIjoiY2sxMXM5aW51MDR4NjNkcDlxYzBuOXNwdyJ9.0i-0Ypvu2ZF5_fHY2ktyvw'
}).addTo(mymap);
$('.leaflet-control-attribution').hide()
function plot(siteDatas,lastDatas){
    var dataMap = mergeSiteLastData(siteDatas,lastDatas)
    dataMap.forEach((data)=>{
        x = iconForTma(data.tma[0],data.th[0],data.th[1],data.th[2])
        plotMap(data.pos,data.site,data.lat,data.long,data.tma[0],data.vair[0],data.ch[0],x)
    })
}


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
function succReq(){
    $('.overlay').remove()
}
function loadReq(){
    $('body').append('<div class= overlay><div class="spinner"></div></>')
}