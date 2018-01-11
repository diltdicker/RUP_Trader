/*
    Author: Dillon Dickerson

    Copyright Dillon Dickerson 2018
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
//const request = require('request');
const http = require('http');
const https = require('https');
const net = require('net');
//const url = require('url');

var app = express();
var apiKey = false;
var apiSecret = false;
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
    var fileContent = fs.readFileSync(process.argv[3], "utf8");
    //console.log("" + fileContent);
    var jsonObj = JSON.parse(fileContent);
    apiKey = jsonObj.api_key;
    apiSecret = jsonObj.api_secret;
    //console.log(apiKey);
    //console.log(apiSecret);
}

const options = {
  hostname: 'api-public.sandbox.gdax.com',
  port: 443,
  path: '/time',
  method: 'GET',
  headers: { 'User-Agent': 'Mozilla/5.0' }
};

const req = https.request(options, (res) => {
  //console.log('statusCode:', res.statusCode);
  //console.log('headers:', res.headers);

  res.on('data', function(d) {
    process.stdout.write(d);
  });

  res.on('end', function() {
     console.log('done');
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();

app.get('/', function (req, res) {
    res.send('RUP-Trader home page');
})

app.get('/time', function (req, res) {
    var data = "soemting here";
    res.send(data);
})

/*
console.log("Starting server on port " + portNum + "...");
var rupServer = app.listen(portNum, function () {
    console.log("Server now running on port " + portNum);
})
*/

function getTime() {
    var ret = '';

}
