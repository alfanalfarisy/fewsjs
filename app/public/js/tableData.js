
function plotTblDpcd(datasDpcd){
    var dataSet = [];
    datasDpcd.forEach(function(data){     

        st=kodest(data.site)
        dt=data.dt;
        lx=data.lx[0]
        t=data.t[0]
        skb=data.skb[0]
        edb=data.edb[0]
        wps=data.wps[0]
        fwps=data.fwps[0]
        vpr=data.vpr[0]
        vbr=data.vbr[0]
        vrl=data.vrl[0]
        ipr=data.ipr[0]
        ibr=data.ibr[0]
        irl=data.irl[0]
        dataSet.push([st,dt,lx,t,skb,edb,wps,fwps,vpr,vbr,vrl,ipr,ibr,irl]);
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
            { title: "skb" },
            { title: "edb" },
            { title: "wps" },
            { title: "fwps" },
            { title: "pr" },
            { title: "vbr" },
            { title: "vrl" },
            { title: "ipr" },
            { title: "ibr" },
            { title: "irl" }

        ],
    } );

}
function plotTblDpsTemp(dataDpsTemp){
    var dataSet = [];
    dataDpsTemp.forEach(function(data){     

        st = kodest(data.site)

        dataSet.push([st,data.dt,data.tma[0],data.ch[0],data.vair[0]]);
        })

    $('.dataTableTemp').DataTable( {
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