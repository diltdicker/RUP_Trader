/*
    Author: Dillon Dickerson
*/
/*
For testing

REST API
https://api-public.sandbox.gdax.com

Websocket Feed
wss://ws-feed-public.sandbox.gdax.com
*/

const fs = require('fs');
const express = require('express');
const request = require('request');

var app = express();
var apiKey = 0;
var apiSecret = 0;
var portNum = 8080;

console.log("RUP-Trader version 0.1.0.2018")
if(process.argv.length > 2) {
    portNum = process.argv[2];
    console.log("Port : " + portNum);
    if (process.argv.length > 3) {
        console.log("API file : " + process.argv[3]);
    }
} else {
    // default port
    console.log("Port : " + portNum);
}

//console.log(process.argv.length);
if (process.argv.length > 3) {
    console.log("Acessing API key...")
    // get the api_key and api_secret
    // this file should be on the base dir of the project
    // this file should be a flat (1 level) json file
    var fileContent = fs.readFileSync(process.argv[3]);
    //console.log("" + fileContent);
    var jsonObj = JSON.parse(fileContent);
    apiKey = jsonObj.api_key;
    apiSecret = jsonObj.api_secret;
    //console.log(apiKey);
    //console.log(apiSecret);
}

app.get('/', function (req, res) {
    res.send('RUP-Trader home page');
})

app.get('/time', function (req, res) {
    var data = "soemting here";
    res.send(data);
})

console.log("Starting server on port " + portNum + "...");
var rupServer = app.listen(portNum, function () {
    console.log("Server now running on port " + portNum);
})
