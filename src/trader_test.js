/*
	@author Dillon Dickerson
	Copyright Dillon Dickerson 2018
*/

/*
============================
Algorithim for Trading
============================
1. generate SMA from data (history size)

2. calculate EMA from SMA

3. calculate EMA from previous EMA

4. Keep list of highest prices over a set durration

5. Keep list of lowest prices over a set durration (both these are from the same list but sorted once)

6. If the delta of the EMA is positive while intersecting the price and the delta of the price is positive and the average of the highest prices shows a good potential profit and the current price is close to the average of the lowest prices: Buy

7. If the delta of the EMA is negative while intersecting the price and the delta of the price is negative and the average of the highest prices is close to the current price or if the current price is a threshold below the buy price: Sell

notes: use unshift() and pop() { new data ---> old data }

*/

const readline = require('readline');
const fs = require('fs');

var algoFileName = "algo_ema.json";
var csvFileName = 'old-data-1.csv';
var algoFileData = fs.readFileSync('json/' + algoFileName);
algoFileData = JSON.parse(algoFileData);

var priceList = Array();
var EMAList = Array();
var EMADelta = 25;
var priceExtremeLength = 25;		// len value should be imported from JSON file
var highPrices = Array();
var lowPrices = Array();
var period = 250;					// len value should be imported from JSON file
var readyToSell = false;			// needs to populate the EMA list to figure out the delta
var SMATrigger = false;				// sma first then get use it as the initial EMA
var weight = 2.0/(period + 1.0);
var cashOnHand = 200.0;
var coin = 0.0;

var arr = [45, 34, 686, 999, 0, -201, 4389, 234, -483, 43, -12, 5];
arr = sortList(arr, true);
console.log(arr);
var tes = arr.slice();
tes = sortList(tes, false);
console.log(arr.slice(0, 0+5) + "\n" + arr.slice(arr.length-5, arr.length));

console.log("===test data===");
console.log("weight: " + weight);
/*
	list: an array containing numbers
	smallToBig: boolean determining order sorted
*/
function sortList(list, smallToBig) {
	var tmp;
	for (var i = 1; i < list.length; i++) {
		var j = i;
		if (smallToBig) {
			while (j > 0 && list[j-1] > list[j]) {
				tmp = list[j];
				list[j] = list[j - 1];
				list[j - 1] = tmp;
				j--;
			}
		} else {
			while (j > 0 && list[j-1] < list[j]) {
				tmp = list[j];
				list[j] = list[j - 1];
				list[j - 1] = tmp;
				j--;
			}
		}
	}
	return list;
}

function getAverage(list) {
	var sum = 0;
	for (var i = 0; i < list.length; i++) {
		sum += list[i];
	}
	return (sum / (list.length));
}

function getEMA(prevEMA, price, weight) {
	var nextEMA = (price * weight) + (((weight*(-1)) + 1) * prevEMA);
	return nextEMA;
}

function addNewPrice(price) {
	if (!SMATrigger) {
		priceList.unshift(price);
		if (priceList.length >= period) {
			SMATrigger = true;
			EMAList.unshift(getAverage(priceList));
		}
	} else {
		priceList.unshift(price);
		priceList.pop();
		EMAList.unshift(getEMA(EMAList[0], price, weight));
		var sortedPrices = sortList(priceList.slice(), false);
		highPrices = sortedPrices.slice(0, priceExtremeLength);
		lowPrices = sortedPrices.slice(sortedPrices.length - priceExtremeLength, sortedPrices.length);
		//
		if (readyToSell) {
			var avg = getAverage(highPrices);
			if (price > avg - 10) {
				sell(price);
			}
		} else {
			var avg = getAverage(lowPrices)
			if (price < avg + 10) {
				buy (price);
			}
		}
	}
}

function buy(price) {
	coin = (cashOnHand / price);
	cashOnHand = 0.0;
	readyToSell = true;
}

function sell(price) {
	cashOnHand = (coin * price);
	coin = 0.0;
	readyToSell = false;
}

const rl = readline.createInterface({
  input: fs.createReadStream('csv/' + csvFileName),
  crlfDelay: Infinity
});

rl.on('line', function (line) {
	var record = line.split(",");
	var recordPrice = parseFloat(record[0]);
	addNewPrice(recordPrice);
	if (SMATrigger) {
		console.log(recordPrice + " : " + EMAList[0] + " : " + getAverage(highPrices) + " : " + getAverage(lowPrices) + " : $" + cashOnHand + " : @" + coin);
	} else {
		console.log(priceList.length);
	}
});
