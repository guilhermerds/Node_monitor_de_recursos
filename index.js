/*const os = require('os');




function myFunc() {
    console.log("Memória : " + os.cpus().c);
}
  
setInterval(myFunc, 1000);*/

const os = require('os-utils');
const disk = require('check-disk-space');

const pcResources = {
    cpuUsage: 0,
    cpuFree: 0,
    hdUsage: 0,
    hdFree: 0,
    memUsage: 0,
    memFree: 0,
};


function resources(){
    os.cpuUsage(function(val){
        pcResources.cpuUsage=val*100;
    });
    
    os.cpuFree(function(val){
        pcResources.cpuFree=val*100;
    });

    disk("/").then(result => {
        pcResources.hdUsage = (result.size - result.free)/1024/1024/1024;
        pcResources.hdFree = result.free/1024/1024/1024;
    });

    pcResources.memUsage = (os.totalmem() - os.freemem())/1024;

    pcResources.memFree = os.freemem()/1024;

    console.log(pcResources);
}

setInterval(resources, 1000);
