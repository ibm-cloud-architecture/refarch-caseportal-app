var request = require('request');

var config = require("../server/config/config.json");

console.log('Test getting customer data from customer microservices');
var options = {
  url: config.customerAPI.url+"/customers/email/eddie@email.com",
  method: "GET",
  headers: {
    "accept": "application/json",
    "content-type": "multipart/form-data",
  }
}

request(options, (err, res, body)  => {
  if (err) { return console.log(err); }
  console.log(body);
});
