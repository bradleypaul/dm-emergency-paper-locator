const axessoKey = `LIf3v3u97Wmshek4PIKJGfwmDRHHp1e33VnjsnxVU7ZUW0fu5W`;
const walmartHost = `axesso-walmart-data-service.p.rapidapi.com`;
const amazonHost = `axesso-axesso-amazon-data-service-v1.p.rapidapi.com`;
const searchButtonEl = document.querySelector('#searchProduct');
var searchResults = [];

// var fakeAmazon = [
//     {
// 		"prime": false,
// 		"title": "Angel Soft, Toilet Paper, Double Rolls, 12 Count of 234 Sheets Per Roll",
// 		"price": "",
// 		"availability": true,
//         "url": "https://www.amazon.com/dp/B000WLGGTQ"
//     },
//     {
// 		"prime": false,
// 		"title": "Amazon Brand - Presto! 308-Sheet Mega Roll Toilet Paper, Ultra-Soft, 6 Count",
// 		"price": "",
// 		"availability": true,
//         "url": "https://www.amazon.com/dp/B07QV942J6"
//     },
// 	{
// 		"prime": false,
// 		"title": "Cottonelle Ultra CleanCare Soft Toilet Paper with Active Cleaning Ripples, 24 Family Mega Rolls",
// 		"price": 25.18,
// 		"availability": false,
//         "url": "https://www.amazon.com/dp/B07ND5BB8V"
//     }
// ];

const sortBy = 'price';
let comparator = (a, b) => {
	if(a[sortBy] < b[sortBy]) return -1;
	else if(a[sortBy] === b[sortBy]) return 0;
	else if(a[sortBy] > b[sortBy]) return 0;
};

//get the product url for the first 3 results from Amazon
function getAmazonUrl(searchTerm) {
	fetch(`https://axesso-axesso-amazon-data-service-v1.p.rapidapi.com/amz/amazon-search-by-keyword-asin?sortBy=relevanceblender&domainCode=com&keyword=${searchTerm}&page=1`, {
		"method": "GET",
		"headers": {
			"x-rapidapi-host": amazonHost,
			"x-rapidapi-key": axessoKey
		}
	})
	.then(response => {
		if (response.ok) {
			response.json().then(function(data){
				//loop through the top three results to get asin
				for(i =0; i < 3; i++) {
					var asin = data.searchProductDetails[i].asin;
					//load asin to get specific product details
					getAmazonProduct(asin);
				}
			});
		}
	});
};


//get the product url for the first 3 results from Walmart
function getWalmartUrl(searchTerm) {
	fetch(`https://axesso-walmart-data-service.p.rapidapi.com/wlm/walmart-search-by-keyword?sortBy=best_match&page=1&keyword=${searchTerm}&type=text`, {
		"method": "GET",
		"headers": {
			"x-rapidapi-host": walmartHost,
			"x-rapidapi-key": axessoKey 
		}
	})
	.then(response => {
		if (response.ok) {
			response.json().then(function(data) {
				for (i=0; i < 3; i++) {
					var produrl = data.foundProducts[i];
					//load product url to get specific product details
					getWalmartProduct(produrl);
				}
			});
		}
	});
};

function getWalmartProduct(produrl) {
	fetch("https://axesso-walmart-data-service.p.rapidapi.com/wlm/walmart-lookup-product?url=https://www.walmart.com" + produrl, {
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "axesso-walmart-data-service.p.rapidapi.com",
			"x-rapidapi-key": "LIf3v3u97Wmshek4PIKJGfwmDRHHp1e33VnjsnxVU7ZUW0fu5W"
		}
	})
	.then(response => {
		if (response.ok) {
			response.json().then(function(data){
				var productDetails = makeWalmartProduct(data);
				searchResults.push(productDetails);
				searchResults.sort(comparator);
			});
		}
	});
};


function getAmazonProduct(asin) {
	fetch("https://axesso-axesso-amazon-data-service-v1.p.rapidapi.com/amz/amazon-lookup-product?url=https://www.amazon.com/dp/" + asin, {
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "axesso-axesso-amazon-data-service-v1.p.rapidapi.com",
			"x-rapidapi-key": "LIf3v3u97Wmshek4PIKJGfwmDRHHp1e33VnjsnxVU7ZUW0fu5W"
		}
	})
	.then(response => {
		//verify a result was received
		if (response.ok) {
			response.json().then(function(data){
				var productDetails = makeAmazonProduct(data);
				console.log("searchResults", searchResults, "productDetails", productDetails);
				displayResults(searchResults);

				searchResults.push(productDetails);
				searchResults.sort(comparator);
			})
		}
	});
};


function makeAmazonProduct(product) {
	return {
		prime: product.prime,
		title: product.productTitle,
		price: product.price || '',
		// availability: isAvailable(product.warehouseAvailability),
		url: `https://www.amazon.com/dp/${product.asin}`
	};
}

function makeWalmartProduct(product) {
	return {
		title: product.productTitle,
		price: product.price || '',
		availability: product.available,
		url: `https://www.walmart.com/ip/${product.walmartItemId}`
	};
}

function isAvailable(availabilityString) {
	return availabilityString && !availabilityString.toLowerCase().includes('unavailable');
}

function setSearchTerm(event, data) {
	//prevent page reload
	event.preventDefault();

	//get the current selected value
	// searchResults = [];
	// searchTerm = document.querySelector('#productSelection').value;

	const searchTerm = document.querySelector('#productSelection').value;
	//call function to fetch product details
	getAmazonUrl(searchTerm);
	getWalmartUrl(searchTerm);
	// var productsTbody = document.querySelector("#products tbody");
	// displayResults(productsTbody, fakeAmazon);
	displayResults(searchResults);
};

function displayResults(searchResults) {
	
	var products = document.getElementById('products');
	var title = document.getElementById('title');
	var price = document.getElementById('price');
	var url = document.getElementById('url');
	for (var i=0; i < searchResults.length; i++) {
		// products.innerHTML = "";
		title.innerHTML += "<td>"+searchResults[i].title+"</td>"
		price.innerHTML += "<td>"+searchResults[i].price+"</td>"
		url.innerHTML += "<td>"+searchResults[i].url+"</td>"
	}
}

// function displayResults(nl, data) { // nl -> NodeList, data -> array with objects
// 	data.forEach((row_key, row_val) => {
// 	  var tr = nl.insertRow(row_val);
// 	// 
// 	// if keys(d).contains() prime: true then "Amazon Prime"
// 	// else if keys(d).contains() prime: false then "Amazon"
// 	// else "Walmart"
// 	  Object.keys(row_key).forEach((col_key, col_val) => { // Keys from object represent th.innerHTML
// 		var cell = tr.insertCell(col_val);
// 		cell.innerHTML = row_key[col_key]; // Assign object values to cells   
// 	  });
// 	  nl.appendChild(tr);
// 	})
// }

searchButtonEl.addEventListener('click', setSearchTerm);
