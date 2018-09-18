var odm = require("../server/routes/features/ODMClient");
var config = require("../server/config/config.json");


console.log('Start testing odm deployed decision service...');
console.log('/tDefine Watson context');
var wcscontext= {'ZipCode': '6300',
 'user' : {'email' : 'eddie@email.com'},
};

odm.recommend(config,wcscontext,function(data) {
  console.log("Response from odm " + JSON.stringify(data));
})
