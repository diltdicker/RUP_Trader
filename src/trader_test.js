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
var csvFileName = /*'1-10-2018-DailyPriceHist.csv';/*/'old-data-1.csv';
var algoFileData = fs.readFileSync('json/' + algoFileName);
algoFileData = JSON.parse(algoFileData);

var priceList = Array();
var EMAList = Array();
var SMAList = Array();
var EMADelta = 100;
var priceExtremeLength = 20;		// len value should be imported from JSON file
var histLen = 1500;
var highLength = 25;
var lowLength = 25;
var highPrices = Array();
var lowPrices = Array();
var period = 2200;					// len value should be imported from JSON file
var readyToSell = false;			// needs to populate the EMA list to figure out the delta
var SMATrigger = false;				// sma first then get use it as the initial EMA
var weight = 2.0/(period + 1.0);
var cashOnHand = 1000.0;
var coin = 0.0;
var threshold = 50;
var sellThreshold = 0.5 * threshold;
var buyprice = 0.0;
var profit = 0.0;
var fees = 0.0;
var btc = 0.0;
var profitList = new Array();
var index = 1;
var EMAHitList = Array();
var EMAHitFlag = false;
var transBuy = 0.0;
var transSold = 0.0;

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

/*
	list: a smaller list (non sorted)
	this is intended for EMAList to determine the delta of the EMA
*/
function getDelta(list) {
	var delta = (list[list.length - 1] - list[0])/(list.length);
	return delta;
}

function getEMA(prevEMA, price, weight) {
	var nextEMA = (price * weight) + (((weight*(-1)) + 1) * prevEMA);
	return nextEMA;
}

function addNewPrice(price) {
	if (!SMATrigger) {
		priceList.unshift(price);
		SMAList.unshift(price);
		if (priceList.length >= period) {
			SMATrigger = true;
			EMAList.unshift(getAverage(priceList));
		}
	} else {
		priceList.unshift(price);
		SMAList.unshift(price);
		if (priceList.length > histLen) {
			priceList = priceList.slice(0, histLen);
		}
		SMAList.pop();
		EMAList.unshift(getEMA(EMAList[0], price, weight));
		var sortedPrices = sortList(priceList.slice(), false);
		highPrices = sortedPrices.slice(0, highLength);
		lowPrices = sortedPrices.slice(sortedPrices.length - lowLength, sortedPrices.length);
		//
		if (EMAList.length > period) {
			if (readyToSell) {
				if (getDelta(EMAList.slice(0, EMADelta)) < 0) {
					var avg = getAverage(highPrices);
					if (price >= avg - 1) {
						//sell(price);
					}
				}
				if (price <= buyprice - sellThreshold) {
					//sell(price);							// short sell
					//console.log("short sell buyprice: " + buyprice + " sellprice: " + price);
				}
			} else {
				if (getDelta(EMAList.slice(0, EMADelta)) > 0) {
					var high = getAverage(highPrices);
					var avg = getAverage(lowPrices);
					if (price <= avg + 1 && (high - price) > 2*threshold) {
						//buy(price);
					}
				}
			}
		}
	}
}

function buy(price) {
	buyprice = price;
	coin = cashOnHand/price;
	transBuy = price * coin;
	fees += transBuy * 0.0025;
	cashOnHand = 0.0;
	readyToSell = true;
	console.log("Buy order");
}

function sell(price) {
	transSold = price * coin;
	fees += transSold * 0.0025;
	profit += transSold - transBuy;
	cashOnHand = transSold;
	console.log("Transaction: buy:" + buyprice + " sold:" + price + " profit:" + (price - transBuy) + " ajusted profit: " + (transSold - transBuy) + " units: " + coin + " fees: " + fees);
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
	if (EMAList.length > 250) {
		//console.log(recordPrice + " : " + /*EMAList[0] + " : " + getAverage(highPrices) + " : " + getAverage(lowPrices) +*/ " : $" + cashOnHand + " : @" + coin + " : " + getDelta(EMAList.slice(0, EMADelta)) + " $$ " + profit + " fees: " + fees + " vol: " + btc + " ROI avg: " + getAverage(profitList));
		if (recordPrice - 5 < EMAList[0] && EMAList[0] < recordPrice + 5) {
			if (!EMAHitFlag) {
				EMAHitList.unshift(recordPrice);
				EMAHitFlag = true;
			} else {
				if (Math.abs(recordPrice - EMAHitList[0]) > 50) {
					EMAHitList.unshift(recordPrice);
					var recomend = "buy";
					if (!readyToSell && getDelta(EMAList.slice(0, EMADelta)) > 0 && Math.abs(getAverage(highPrices) - recordPrice) > Math.abs(getAverage(lowPrices) - recordPrice)) {
						buy(recordPrice);
					} else if (readyToSell && getDelta(EMAList.slice(0, EMADelta)) < 0 && Math.abs(getAverage(highPrices) - recordPrice) < Math.abs(getAverage(lowPrices) - recordPrice)){
						sell(recordPrice);
					}
					/*if (Math.abs(getAverage(highPrices) - recordPrice) > Math.abs(getAverage(lowPrices) - recordPrice)) {
						recomend = "sell";
						if (readyToSell && getDelta(EMAList.slice(0, EMADelta)) < 0) {
							sell(recordPrice);
						}
					} else {
						if (!readyToSell && getDelta(EMAList.slice(0, EMADelta))> 0 && (getAverage(highPrices) >= (recordPrice - getAverage(lowPrices)) * 3) ) {
							buy(recordPrice);
						}
					}
					if (readyToSell && recordPrice < buyprice - 125) {
						//sell(recordPrice);
						//console.log("short sell");
					}*/
					console.log(recordPrice + ", " + getAverage(highPrices) + ", " + getAverage(lowPrices) + ", " + recomend + ", profit:" + profit + ", delta: " + getDelta(EMAList.slice(0, EMADelta)) + ", margin est:" + (getAverage(highPrices) - getAverage(lowPrices)) + ", loss " + Math.abs(getAverage(lowPrices) - recordPrice) + ", gain " + Math.abs(getAverage(highPrices) - recordPrice) );
				}
			}
		}

		var output = "" + index + "," + recordPrice + "," + EMAList[0] + "," + getAverage(SMAList) + "," + getAverage(highPrices) + "," + getAverage(lowPrices) + "\n";
		//appendCSV(output);
		index++;
	} else {
		//console.log(priceList.length);
	}
});

function appendCSV(data) {
    fs.appendFile(('./csv/' + "analysis_data.csv"), data, "utf8", function(err) {
        // do nothing
        if(err) {
            console.error(err);
        } else {
            //console.log("appened ./" + dayString + "DailyPriceHist.csv");
        }
    });
}
