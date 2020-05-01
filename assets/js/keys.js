const axsessoKey = `LIf3v3u97Wmshek4PIKJGfwmDRHHp1e33VnjsnxVU7ZUW0fu5W`;
const walmartHost = `axesso-walmart-data-service.p.rapidapi.com`;
const amazonHost = `axesso-axesso-amazon-data-service-v1.p.rapidapi.com`;
const searchTerm = 'Playstation'
fetch(`https://axesso-axesso-amazon-data-service-v1.p.rapidapi.com/amz/amazon-search-by-keyword-asin?sortBy=relevanceblender&domainCode=com&keyword=${searchTerm}&page=1`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": amazonHost,
		"x-rapidapi-key": axsessoKey
	}
})
.then(response => response.json())
.then(result => console.log(result))
.catch(err => {
	console.log(err);
});


fetch(`https://axesso-walmart-data-service.p.rapidapi.com/wlm/walmart-search-by-keyword?sortBy=best_match&page=1&keyword=${searchTerm}&type=text`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": walmartHost,
		"x-rapidapi-key": axsessoKey
	}
})
.then(response => response.json())
.then(result => console.log(result))
.catch(err => {
	console.log(err);
});

fetch("https://axesso-walmart-data-service.p.rapidapi.com/wlm/walmart-lookup-product?url=https://www.walmart.com/ip/Sony-PlayStation-4-Slim-500GB-Gaming-Console-Black-CUH-2115A/536117094", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "axesso-walmart-data-service.p.rapidapi.com",
		"x-rapidapi-key": "LIf3v3u97Wmshek4PIKJGfwmDRHHp1e33VnjsnxVU7ZUW0fu5W"
	}
})
.then(response => response.json())
.then(result => console.log(makeWalmartProduct(result)))
.catch(err => {
	console.log(err);
});

fetch("https://axesso-axesso-amazon-data-service-v1.p.rapidapi.com/amz/amazon-lookup-product?url=https://www.amazon.com/PlayStation-Slim-1TB-Console-Bundle-4/dp/B07YLDNTKB", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "axesso-axesso-amazon-data-service-v1.p.rapidapi.com",
		"x-rapidapi-key": "LIf3v3u97Wmshek4PIKJGfwmDRHHp1e33VnjsnxVU7ZUW0fu5W"
	}
})
.then(response => response.json())
.then(result => console.log(makeAmazonProduct(result)))
.catch(err => {
	console.log(err);
});

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