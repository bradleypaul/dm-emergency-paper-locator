const axessoKey = `LIf3v3u97Wmshek4PIKJGfwmDRHHp1e33VnjsnxVU7ZUW0fu5W`;
const walmartHost = `axesso-walmart-data-service.p.rapidapi.com`;
const amazonHost = `axesso-axesso-amazon-data-service-v1.p.rapidapi.com`;
const searchButtonEl = document.querySelector('#searchProduct');
const errorModal = document.querySelector("#error-modal")
const errorMessage = document.querySelector("#error-message")
const errorClose = document.querySelector("#modal-close-btn")
const productTableEl = document.getElementById("products");
var searchResults = [];

var error = function(x){
	errorModal.setAttribute("style","display:visible;");
	errorMessage.textContent="Error: "+ x ;
    var closeModal=function() {
	errorModal.setAttribute("style","display:none;");
	}
	errorClose.addEventListener("click",closeModal);

}

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
		} else {
			//error modal
			error( response.statusText);

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
		} else {
			//error modal
			error( response.statusText);
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
				searchResultsComplete()
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
				searchResults.push(productDetails);
				searchResults.sort(comparator);
				searchResultsComplete()
			})
		}
	});
};


function makeAmazonProduct(product) {
	return {
		retailer: "Amazon",
		prime: product.prime,
		title: product.productTitle,
		price: product.price || 'N/A',
		availability: isAvailable(product.warehouseAvailability),
		url: `https://www.amazon.com/dp/${product.asin}`
	};
}

function makeWalmartProduct(product) {
	return {
		retailer: "Walmart",
		title: product.productTitle,
		price: product.price || 'N/A',
		availability: product.available,
		url: `https://www.walmart.com/ip/${product.walmartItemId}`
	};
}

function isAvailable(availabilityString) {
	// unavailable products return "Currently unavailable. We don't know when or if this item will be back in stock."
	// available products can return either "In stock" or "Available from these sellers..."
	// search for unavailable instead and not the result
	return availabilityString && !availabilityString.toLowerCase().includes('unavailable');
}

function setSearchTerm(event) {
	//prevent page reload
	event.preventDefault();

	//remove current search results
	productTableEl.innerHTML = '';

	//get the current selected value
	searchResults = [];
	var searchTerm = document.querySelector('#productSelection').value;
	
	//call function to fetch product details	
	var display=document.querySelector("#results")
	var header=document.querySelector("#header")


	header.setAttribute("style","padding-top: 10%; padding-bottom: 1%")
	display.setAttribute("style","display:visable;")

	getAmazonUrl(searchTerm);
	getWalmartUrl(searchTerm);
};

function searchResultsComplete() {
	//check to ensure that searchResults is complete
	if (searchResults.length === 6) {
		//run displayResults function once to avoid looped results
		saveResults();
		displayResults();
	}
};

function loadResults() {
	var recentResults = localStorage.getItem('searchResults');

	if (!recentResults) {
		return false;
	}

	//convert back into array
	searchResults = JSON.parse(recentResults);

	//display results
	displayResults();
};

function saveResults() {
	localStorage.setItem('searchResults', JSON.stringify(searchResults));
};

function displayResults() {	
	var table = "";
	searchResults = searchResults.filter(product => product.isAvailable);
	for (var i=0; i < searchResults.length; i++) {
		var tr = "<tr>";
		if (searchResults[i].retailer === "Amazon") {
			if (searchResults[i].prime) {
				tr += "<td>"+searchResults[i].retailer+' <img class="prime-icon" src="./assets/images/prime-icon.svg"'+"</td>"; // FIX PRIME IMAGE
			} else {
				tr += "<td>"+searchResults[i].retailer+"</td>";
			}
		} else {
			tr += "<td>"+searchResults[i].retailer+"</td>";
		}
		
		tr += "<td>"+searchResults[i].title+"</td>";
		tr += "<td>"+"$"+searchResults[i].price+"</td>";
		tr += "<td>"+searchResults[i].availability+"</td>";
		tr += "<td>"+'<a class="button" href="'+searchResults[i].url+'" target="_blank">Go to Site</a>'+"</td>"; // WALMART URL BROKEN
		tr += "</tr>";
		  table += tr;
	}
	productTableEl.innerHTML += table;
};

loadResults();
searchButtonEl.addEventListener('click', setSearchTerm);
