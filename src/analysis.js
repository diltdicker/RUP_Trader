/*
    Author Dillon Dickerson
*/

const readline = require('readline');
const fs = require('fs');
var csvFileName = 'old-data-1.csv';
var algoFileName = 'algo_sma.json';
var algoFileData = fs.readFileSync('json/' + algoFileName);
algoFileData = JSON.parse(algoFileData);

var method;
var timetype;
var value;
var delay;
var index = 1;
var list = Array();
var listFill = 0;
var list2;
var derivative;
var derivative2;

if (algoFileData.method == "sma") {
    method = 1;
}
if (algoFileData.timetype == "tick") {
    timetype = 1;
}
if (method == 1 && timetype == 1) {
    value = algoFileData.value;
    delay = algoFileData.delay;
}

function calcSMA(lis, len) {
    var ret = 0.0;
    for (var i = 0; i < lis.length; i++) {
        ret += lis[i];
    }
    return (ret/len);
}

const rl = readline.createInterface({
  input: fs.createReadStream('csv/' + csvFileName),
  crlfDelay: Infinity
});

rl.on('line', function (line) {
    var data = line.split(',');
    var price = parseFloat(data[0]);
    if (listFill < value) {
        list.unshift(price);
        listFill++;
    } else {
        list.pop();
        list.unshift(price);
    }
    var dataVal;
    if (listFill < value) {
        console.log(price);
    } else {
        if (method == 1) {
            dataVal = calcSMA(list, value);
        }
        fs.appendFile('csv/analysis_data.csv', (price + ',' + dataVal + ',' + index + '\n'), 'utf8', function () {

        })
        console.log(price + '\t' + dataVal + '\t' + index);
        index++;
    }

        //Number(data[0]));
});

rl.on('close', function () {
    console.log('\nEnd of File\n');
});
