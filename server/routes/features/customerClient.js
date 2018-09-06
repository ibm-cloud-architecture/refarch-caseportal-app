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
 * Jerome Boyer IBM boyerje@us.ibm.com
 */
var https=require('https');

const request = require('request').defaults({strictSSL: false});
const CommandsFactory = require('hystrixjs').commandFactory;

var buildOptions=function(met,aPath,config){
  console.log("build option config " + JSON.stringify(config,null,2));
  return {
    url: config.customerAPI.url+aPath,
  //  path:apath,

    method: met,
    rejectUnauthorized: true,
    //ca: caCerts,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json'
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

// what run in the command pattern. Must returns a Promise
var run = function(config,email){
  return new Promise(function(resolve, reject){
      var opts = buildOptions('GET','/customers/email/'+email,config);
      opts.headers['Content-Type']='multipart/form-data';
      request(opts,function (error, response, body) {
        if (error) {reject(error)}
        resolve(body);
      });
  });
}

var serviceCommand =CommandsFactory.getOrCreate("getCustomerDetail")
  .run(run)
  .timeout(5000)
  .requestVolumeRejectionThreshold(2)
  .build();

module.exports = {
  // Load all customers.
  getCustomers : function(config,req,res){
    var opts = buildOptions('GET','/customers',config);
    processRequest(res,opts);
  },
  getCustomer : function(config,req,res){
    var opts = buildOptions('GET','/customers/'+req.params.id,config);
    opts.headers['Content-Type']='multipart/form-data';
    processRequest(res,opts);
  },

  getCustomerByEmail: function(config,req,res){
    var opts = buildOptions('GET','/customers/email/'+req.params.email,config);
    opts.headers['Content-Type']='multipart/form-data';
    processRequest(res,opts);
  },
  newCustomer : function(config,req,res){
    var opts = buildOptions('POST','/customers',config);
    opts.body=      JSON.stringify(req.body.customer);
    processRequest(res,opts);
  }, // new item
  saveCustomer: function(config,req,res){
    var opts = buildOptions('PUT','/customers/'+req.params.id,config);
    opts.body=      JSON.stringify(req.body.item);
    processRequest(res,opts);
  }, // update item
  deleteCustomer : function(config,req,res){
    var opts = buildOptions('DELETE','/customers/'+req.params.id,config);
    opts.headers['Content-Type']='multipart/form-data';
    processRequest(res,opts);
  }, // delete item
  getCustomerDetail : function(config,email) {
      return serviceCommand.execute(config,email);
  }
} // export
