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

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
{
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
}).addTo(mymap);
$('.leaflet-control-attribution').hide()
function plot(siteDatas,lastDatas){
    var dataMap = mergeSiteLastData(siteDatas,lastDatas)
    dataMap.forEach((data)=>{
        x = iconForTma(data.tma[0],data.th[0],data.th[1],data.th[2])
        plotMap(data.pos,data.site,data.lat,data.long,data.tma[0],data.vair[0],data.ch[0],x)
    })
}


