const axsessoKey = `LIf3v3u97Wmshek4PIKJGfwmDRHHp1e33VnjsnxVU7ZUW0fu5W`;
const walmartHost = `axesso-walmart-data-service.p.rapidapi.com`;
const amazonHost = `axesso-axesso-amazon-data-service-v1.p.rapidapi.com`;
const searchButtonEl = document.querySelector('#searchProduct');
var searchResults = [];

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
			"x-rapidapi-key": axsessoKey
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
			"x-rapidapi-key": axsessoKey
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
				searchResults.push(productDetails).sort(comparator);
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
				searchResults.push(productDetails).sort(comparator);
			})
		}
	});
};


function makeAmazonProduct(product) {
	return {
		title: product.productTitle,
		price: product.price || '',
		availability: isAvailable(product.warehouseAvailability),
		prime: product.prime,
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
	return availabilityString.toLowerCase().includes('available')
}

function setSearchTerm(event) {
	//prevent page reload
	event.preventDefault();

	//get the current selected value
	const searchTerm = document.querySelector('#productSelection').value;
	console.log(searchTerm)
	//call function to fetch product details

	
var display=document.querySelector("#results")
var headerr=document.querySelector("#header")


headerr.setAttribute("style","padding-top: 10%; padding-bottom: 1%")
display.setAttribute("style","display:visable;")

	getAmazonUrl(searchTerm);
	getWalmartUrl(searchTerm);

};

searchButtonEl.addEventListener('click', setSearchTerm);
