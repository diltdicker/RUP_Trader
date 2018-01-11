/*
    Author: Dillon Dickersonw
*/
/*
    dependency
    https://github.com/websockets/ws
*/

const fs = require('fs');
const ws = require('ws');
const mkdirp = require('mkdirp');

var currentDay = new Date();
var gdaxSocket = new ws('wss://ws-feed-public.sandbox.gdax.com');

gdaxSocket.on('open', function open() {
    gdaxSocket.send('{"type": "subscribe","product_ids": ["ETH-USD","ETH-EUR"],"channels": ["level2","heartbeat",{"name": "ticker","product_ids": ["ETH-BTC","ETH-USD"]}]}');
});

gdaxSocket.on('message', function incoming(data) {
    console.log(data);
});
//var dayString = (currentDay.getMonth() + " " + currentDay.getDay() + " " + currentDay.getYear());
console.log(currentDay.getDate().toString());

//appendCSV('');

console.log("done");

function appendCSV(data) {
    var currentDay = new Date();
    var dayString = (currentDay.getMonth() + 1) + "-" + currentDay.getDate() + "-" + currentDay.getFullYear() + "-";
    fs.appendFile(('./csv/' + dayString + "DailyPriceHist.csv"), data, function(err) {
        // do nothing
        console.log("write");
    });
}


module.exports = {

};
