/**
 * Copyright 2017 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *  * Jerome Boyer IBM boyerje@us.ibm.com 
 */
var https=require('https');

const request = require('request').defaults({strictSSL: false});
var fs = require('fs');
var path = require('path');
var caCerts =fs.readFileSync(path.resolve(__dirname, '../../../ssl/ca.all.crt.pem'));


/**
Build the HTTP header to be used to call back end services using TLS. It ingects the
JWT token in authorization. The token was part of the login response
*/
var buildOptions=function(token,met,aPath,config){
  return {
    url: config.getGatewayUrl()+aPath,
  //  path:apath,
    method: met,
    rejectUnauthorized: true,
    //ca: caCerts,
    headers: {
      'X-IBM-Client-Id': config.getAPICClientId(),
      accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Bearer '+token
    }
  }
}


var processRequest = function(res,opts) {
  console.log(`processing request to url [${opts.method}]:`, JSON.stringify(opts))
  request(opts,
      function (error, response, body) {
        if (error) {
          console.error("Process Request Error: "+error);
          return res.status(500).send({error:error});
        }
        res.send(body);
      }
     );
}


module.exports = {
  // Load all items. Need to be modified to get items from id
  getItems : function(config,req,res){
    var user = JSON.parse(req.user)
    var opts = buildOptions(user.access_token,'GET','/items',config);
    processRequest(res,opts);
  },// getItems
  newItem : function(config,req,res){
    var user = JSON.parse(req.user)
    var opts = buildOptions(user.access_token,'POST','/items',config);
    opts.body=      JSON.stringify(req.body.item);
    processRequest(res,opts);
  }, // new item
  saveItem: function(config,req,res){
    var user = JSON.parse(req.user)
    var opts = buildOptions(user.access_token,'PUT','/item/'+req.params.id,config);
    opts.body=      JSON.stringify(req.body.item);
    processRequest(res,opts);
  }, // update item
  deleteItem : function(config,req,res){
    var user = JSON.parse(req.user)
    var opts = buildOptions(user.access_token,'DELETE','/item/'+req.params.id,config);
    opts.headers['Content-Type']='multipart/form-data';
    processRequest(res,opts);
  } // delete item
}; // exports
