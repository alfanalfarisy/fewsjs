		var dataCuaca=[];
		jQuery(document).ready(function(){
			$.ajax({
				type: "GET",
				url: "/xml/DigitalForecast-DKIJakarta.xml",
				dataType: "xml",
				success: function(data) {
					timeClass = {
						'0000' : 'Pagi Hari',
						'0600' : 'Siang Hari',
						'1200' : 'Malam Hari',
						'1800' : 'Dini Hari',
					};
					kodeCuaca = {
						"0" : 'Cerah',
						"100" : 'Cerah',
						"1" : 'Cerah Berawan',
						"101" : 'Cerah Berawan',
						"2 ": 'Cerah Berawan',
						"102" : 'Cerah Berawan',
						"3" : 'Berawan',
						"103" : 'Berawan',
						"4" : 'Berawan Tebal',
						"104" : 'Berawan Tebal',
						"5" :'Udara Kabur',
						"10" :'Asap',
						"45" :'Kabut',
						"60" :'Hujan Ringan',
						"61" :'Hujan Ringan',
						"63" :'Hujan Lebat',
						"80" :'Hujan Lokal',
						"95" :'Hujan Petir',
						"97" : 'Hujan Petir'
					};
					var xml = jQuery(data);
					var infoCuaca='';
					var dataweather=[];
					jQuery(xml).find("area[id=501192]").find("parameter[id=hu]").find("timerange").each(function(err,res){

						var datetime = jQuery(this).attr("datetime");
						var day = datetime.substring(0,8);
						var time = datetime.substring(8,12);

						var hu = jQuery(xml).find("area[id=501192]").find("parameter[id=hu]").find("timerange[datetime="+datetime+"]").find("value").text();
						var t = jQuery(xml).find("area[id=501192]").find("parameter[id=t]").find("timerange[datetime="+datetime+"]").find("value[unit=C]").text();
						var humax = jQuery(xml).find("area[id=501192]").find("parameter[id=humax]").find("timerange[day="+day+"]").find("value").text();
						var tmax = jQuery(xml).find("area[id=501192]").find("parameter[id=tmax]").find("timerange[day="+day+"]").find("value[unit=C]").text();
						var humin = jQuery(xml).find("area[id=501192]").find("parameter[id=humin]").find("timerange[day="+day+"]").find("value").text();
						var tmin = jQuery(xml).find("area[id=501192]").find("parameter[id=tmin]").find("timerange[day="+day+"]").find("value[unit=C]").text();
						var weather = jQuery(xml).find("area[id=501192]").find("parameter[id=weather]").find("timerange[datetime="+datetime+"]").find("value").text();
						var wd = jQuery(xml).find("area[id=501192]").find("parameter[id=wd]").find("timerange[datetime="+datetime+"]").find("value[unit=CARD]").text();
						var ws = jQuery(xml).find("area[id=501192]").find("parameter[id=ws]").find("timerange[datetime="+datetime+"]").find("value[unit=Kt]").text();
						var ampm = ( time == "1200"|| time=="1800" ) ? "pm" : "am"

						tanggal=day.substring(0,4)+'/'+day.substring(4,6)+'/'+day.substring(6,8)
						weather = kodeCuaca[weather];
						time = timeClass[time];
						var image = "https://www.bmkg.go.id/asset/img/weather_icon/ID/"+weather+"-"+ampm+".png"

						infoCuaca+= 
						'<div class="col-12 col-sm-12">' +
							'<div class="card">' +
								'<div class="card-body text-center">' +
									'<p class="tanggal">'+tanggal+'</p>' +
									'<p class="time">'+time+'</p>'+
									'<img class="weather-img" src="'+image+'" height="90px">'+
									'<p class="weather">'+weather+'</p>'+
									'<p class="temp">'+t+'°C</p>'+
									'<p>'+
										'<i class="wi wi-direction-up"></i><span class="tmax">'+tmax+'°C</span>' +
										'<i class="wi wi-direction-down"></i><span class="tmin">'+tmin+'°C</span> '+
										'<i class="wi wi-raindrop"></i><span class="humid">'+hu+'%</span></p>'+
									'<p class="ws d-sm-none d-md-block"><i class="wi wi-strong-wind"></i> <span>'+ws+' Kt</span></p>'+
								'</div>'+
							'</div>	'+
						'</div>	'
					});

						$("#infoCuaca").html(infoCuaca)
						$(document).ready(function(){ 
							$("#infoCuaca").owlCarousel({
							loop:true,
							responsive:{
								0:{items:1,},
								1000:{items:4,}},
								500:{items:2,},
								// nav:true,
								autoplay:true,
								autoplayTimeout:3000,
								autoplayHoverPause:true });
						});
				},
				error: function(xhr, status) {
					/* handle error here */
				}
			});
		});