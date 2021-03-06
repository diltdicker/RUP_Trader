/*
    Author: Dillon Dickersonw
*/
/*
    dependency
    https://github.com/websockets/ws

    wss://ws-feed-public.sandbox.gdax.com
    wss://ws-feed.gdax.com
*/

const fs = require('fs');
const ws = require('ws');
const mkdirp = require('mkdirp');

var subscribeFlag = 2;
var subscribeFile = "./json/btc_ticker.json";
var websocketFile = "./json/hosts_real.json";
var subscribeFileData = fs.readFileSync(subscribeFile, "utf8");
var websocketFileData = fs.readFileSync(websocketFile, "utf8");
websocketFileData = JSON.parse(websocketFileData);

mkdirp('./csv', function(err) {
    if(err){
        console.error(err);
    } else {
        console.log('directory csv created');
    }
});

//var dayString = (currentDay.getMonth() + " " + currentDay.getDay() + " " + currentDay.getYear());
//console.log(currentDay.getDate().toString());

//appendCSV('');

//console.log("done");

function appendCSV(data) {
    var currentDay = new Date();
    var dayString = (currentDay.getMonth() + 1) + "-" + currentDay.getDate() + "-" + currentDay.getFullYear() + "-";
    fs.appendFile(('./csv/' + dayString + "DailyPriceHist.csv"), data, "utf8", function(err) {
        // do nothing
        if(err) {
            console.error(err);
        } else {
            console.log("appened ./" + dayString + "DailyPriceHist.csv");
        }
    });
}

// Listening on the Websocket
var gdaxSocket = new ws(websocketFileData.websocket);

gdaxSocket.on('open', function open() {
    gdaxSocket.send(subscribeFileData);
    subscribeFlag = 2;
});

gdaxSocket.on('message', function incoming(data) {
    console.log('flag ' + subscribeFlag);
    //console.log(data);
    var jsonObj = JSON.parse(data);
    //console.log(jsonObj);
    var moddedData = jsonObj.price + "," + jsonObj.side + "," + jsonObj.time + "\n";
    console.log(moddedData);
    if (subscribeFlag > 0) {
        subscribeFlag = subscribeFlag - 1;
    } else {
        appendCSV(moddedData);
    }
});
