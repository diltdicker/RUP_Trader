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
*/

var priceList = Array();
var EMAList = Array();
var lenHighest = 25;		// len value should be imported from JSON file
var lenPrices = 250;		// len value should be imported from JSON file
var readyToSell = false;	// needs to populate the EMA list to figure out the delta
var SMATrigger = false;		// sma first then get use it as the initial EMA


function sortList(list) {
	return list;
}

function getAverage(list) {
	var sum = 0;
	for (var i = 0; i < list.length; i++) {
		sum += list[i];
	}
	return (sum / (list.length));
}

function getEMA(prevEMA, len) {
	return prevEMA;
}

function addNewPrice(price) {

}
