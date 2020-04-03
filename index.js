const os = require('os-utils');
const disk = require('check-disk-space');
const blessed = require('blessed')
const contrib = require('blessed-contrib')
const screen = blessed.screen();
const grid = new contrib.grid({rows: 12, cols: 12, screen: screen});

const donutHd = grid.set(0,0,6,6, contrib.donut ,{
    label: 'HD',
	radius: 16,
	arcWidth: 3,
	remainColor: 'black',
	yPadding: 2,
	data: [
	  {percent: 100, label: 'C:', color: 'green'}
	]
});

const gaugeMem = grid.set(0,6,6,6,contrib.gauge, {
    label: 'Ram', 
    stroke: 'green', 
    fill: 'white'
});
gaugeMem.setPercent(100);
let values=[5, 1, 7, 5, 8,12];

const lineCpu =grid.set(6,0,6,12, contrib.line,
    { style:
      { line: "yellow"
      , text: "green"
      , baseline: "black"}
    , xLabelPadding: 3
    , xPadding: 5
    , height: 15
    , label: 'CPU'})
, data = {
    x: ['t1', 't2', 't3', 't4', 't5'],
    y: [0, 0, 0, 0, 0, 0]
 }

 lineCpu.setData(data);



screen.key(['escape'], function(ch, key) {
    return process.exit(0);
});

//--------------------------------------

const pcResources = {
    cpuUsage: 0,
    hdUsage: 0,
    memUsage: 0,
};


function resources(){
    os.cpuUsage(function(val){
        pcResources.cpuUsage=val*100;
    });
    disk("/").then(result => {
        pcResources.hdUsage = (result.size - result.free) * 100 / result.size;
    });

    pcResources.memUsage = (os.totalmem() - os.freemem()) * 100 / os.totalmem() ;
    
    createGraphcs(pcResources);
}

setInterval(resources, 1000);


function createGraphcs(x){
    donutHd.setData([{percent: x.hdUsage, label: 'C:', color: 'green'}]);
    gaugeMem.setPercent(x.memUsage);

    for(i=6; i < 0;i++){
        values[i ] = values[i - 1];
    }
    values[0] =values[1];
    values[1] =values[2];
    values[2] =values[3];
    values[3] =values[4];
    values[4] =values[5];
    values[5] = x.cpuUsage;

    lineCpu.setData({x: [' ', ' ', ' ', ' ', ' '], y: values});
    
    screen.render();
}
