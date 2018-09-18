/**
 * Copyright 2018 IBM Corp. All Rights Reserved.
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
 */
/**
When a customer is asking about recommendation to move the chat bot will ask about the date
and the target zipcode.
This module delegates the product recommendation to a decision service deployed on ODM platform.
Author: IBM - Jerome Boyer / Guilhem Molines
*/
var request = require('request');
var crmClient = require('./customerClient');

module.exports=  {
  /**
  The wcsresponse is the Conversation response. ODM will use its variables set in the context, plus extra data to take a decision.
  ODM output will be added to the Conversation context as well.
  */
  recommend : function(config,wcspayload,next){
    if (config.debug) {
      console.log('ODM recommend start');
      console.log("Response from WCS to handle by ODM: " + JSON.stringify(wcspayload));
    }
    prepareODMInputData(config,wcspayload, function(data){
        // for ODM just send the context
        if (config.debug) {
          console.log('Sending data: ' + data);
        }
        // Config for the POST to the ODM Rule Execution Server
        var options = {
          protocol: config.odm.protocol,
          hostname: config.odm.hostname,
          port: config.odm.port,
          path: config.odm.path,
          url: config.odm.protocol + "//" + config.odm.hostname + ":" + config.odm.port + config.odm.path,
          method: 'POST',
          headers: {
             "accept": "application/json",
             "content-type": "application/json",
             Authorization: config.odm.authtoken
          },
          body: data
        }
        request(options, (err,res,body) => {
          if (err) {
            console.log('Problem with Recommendation  from ODM: ' + err);
            next(wcspayload);
          }
          if (config.debug) {
              console.log('Received from ODM: ' + body);
          }
          response = JSON.parse(body);

          wcspayload.context.recommendation=response.recommendation;
          next(wcspayload);
        }) // do the POST
    }) // prepareODMInput
 } // recommend function
} // exports

// ------------------------------------------------------------
// Private
// ------------------------------------------------------------


// Computes the data that we need to upload to ODM for taking the Decision
// The choice here is to include two things:
// - the context part of the Watson Conversation response. This is where data that has been gathered
//   by the bot during the conversation are stored, and the Decision Services may rely on some of these
// data to take decision
var prepareODMInputData = function(config,wcspayload,next) {
  console.log('Preparing ODM Input Data');
  console.log(JSON.stringify(wcspayload));
  if (wcspayload.context.user.zipCode === undefined) {
    crmClient.getCustomerDetail(config,wcspayload.context.user.email).then(response => {
      var data = JSON.parse(response);
      if (data.existingProducts === undefined) {
        data.existingProducts = [];
      }
      // hack: THE FOLLOWING LINES ARE UGLY.... this is a problem of interface mapping.
      data.existingProducts.push({
        "name": "ADSL p0",
        "packageName": "ADSL 20MBPS",
        "productCategory": "ADSL",
        "monthlyUsage": 3,
        "downloadSpeed": 3,
        "price": 25
      },
      {
        "name": "IPTV",
        "packageName": "IPTV Basic",
        "productCategory": "IPTV",
        "monthlyUsage": 3,
        "downloadSpeed": 3,
        "price": 30
      })
      if (data['carOwner'] === "T") {
        data['carOwner']=true;
      } else {
        data['carOwner']=false;
      }
      c = {}
      data['newZipCode']=wcspayload.context.ZipCode;
      data['previousZipCode'] = data.zipCode;
      delete data.churnRisk;
      delete data.churnClass;
      delete data.churnStatus;
      delete data.zipCode;
      delete data.accountNumber;
      delete data.longDistance;
      delete data.longDistanceBillType;
      delete data.international;
      delete data.local;
      delete data.localBillType;
      delete data.balance;
      delete data.usage;
      delete data.dropped;
      delete data.paymentMethod;
      delete data.ratePlan;
      c['customer']=data;
      next(JSON.stringify(c));
    })
    .catch(error => {
      console.log(error);
    })
  }
} // prepareODMInputData
