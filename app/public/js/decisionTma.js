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