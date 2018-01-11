/*
    Author: Dillon Dickersonw
*/
/*
    dependency
    https://github.com/websockets/ws
*/

const fs = require('fs');
const ws = require('ws');

var currentDay = new Date();
//var dayString = (currentDay.getMonth() + " " + currentDay.getDay() + " " + currentDay.getYear());
console.log(currentDay.getDate().toString());

appendCSV('');

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
