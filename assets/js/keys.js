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

fetch("https://axesso-walmart-data-service.p.rapidapi.com/wlm/walmart-lookup-product?url=https%253A%252F%252Fwww.walmart.com%252Fip%252FSony-PlayStation-4-Slim-500GB-Gaming-Console-Black-CUH-2115A%252F536117094", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "axesso-walmart-data-service.p.rapidapi.com",
		"x-rapidapi-key": "LIf3v3u97Wmshek4PIKJGfwmDRHHp1e33VnjsnxVU7ZUW0fu5W"
	}
})
.then(response => response.json())
.then(result => console.log(result))
.catch(err => {
	console.log(err);
});

fetch("https://axesso-axesso-amazon-data-service-v1.p.rapidapi.com/amz/amazon-lookup-product?url=https%253A%252F%252Fwww.amazon.com%252FPlayStation-Slim-1TB-Console-Bundle-4%252Fdp%252FB07YLDNTKB%252F", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "axesso-axesso-amazon-data-service-v1.p.rapidapi.com",
		"x-rapidapi-key": "LIf3v3u97Wmshek4PIKJGfwmDRHHp1e33VnjsnxVU7ZUW0fu5W"
	}
})
.then(response => response.json())
.then(result => console.log(result))
.catch(err => {
	console.log(err);
});