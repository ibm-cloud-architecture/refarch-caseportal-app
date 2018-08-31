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

 * This implementation illustrates a direct connection to a SOAP back end. The call is an HTTP post
 * with xml envelope and payload depending of the operation to call. As the response is an xml message
 * the code needs to transform to JSON and return the response.
 * We did not cover all the backend operation, but only a few of them.
 */
var convert = require('xml-js');

const request = require('request-promise').defaults({strictSSL: false});
const nsPrefix = 'a:';

var processRequest = function(res,config,body) {
  let xml = '<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\"  xmlns:ws=\"http://ws.inventory/\"> <soapenv:Header/> <soapenv:Body> ' + body + '</soapenv:Body></soapenv:Envelope>'
  let opts = {
    url: config.getInventoryDAL(),
    headers: {
      'Content-Type': 'text/xml;charset=UTF-8',
      'User-Agent': 'nodejs-httpclient'
    },
    body: xml
  }
  console.log('processing request to url ' + JSON.stringify(opts));
  return request.post(opts,
      (error, response, newbody) => {
        if (error) {
          console.error("Process Request Error: "+error);
          return {error:error};
        }
        return newbody;
      }
     );
}

// To parse the XML response to json
// ---------------------------------
// without any processing the <quantity>12</quantity> will be "quantity":{"_text":"0"}
// we want "quantity": 0
// transform the value to number or boolean when it makes sense
function nativeType(value) {
  var nValue = Number(value);
  if (!isNaN(nValue)) {
    return nValue;
  }
  var bValue = value.toLowerCase();
  if (bValue === 'true') {
    return true;
  } else if (bValue === 'false') {
    return false;
  }
  return value;
}
// function to be called to customize _text element
var removeJsonTextAttribute = function(value, parentElement) {
    try {
      var keyNo = Object.keys(parentElement._parent).length;
      var keyName = Object.keys(parentElement._parent)[keyNo - 1];
      parentElement._parent[keyName] = nativeType(value);
    } catch (e) {}
}
var xml2jsonOptions = {
    compact: true,
    trim: true,
    ignoreDeclaration: true,
    ignoreInstruction: true,
    ignoreAttributes: true,
    ignoreComment: true,
    ignoreCdata: true,
    ignoreDoctype: true,
    textFn: removeJsonTextAttribute
  };

module.exports = {
  // Load all items. Need to be modified to get items from id
  getItems : function(config,req,res){
    let body = '<ws:getItems/>';
    processRequest(res,config,body).then(function(data) {
        let jsonrepstr = convert.xml2json(data, xml2jsonOptions);
        console.log(jsonrepstr);
        let jsonrep = JSON.parse(jsonrepstr);

        var items = jsonrep['soap:Envelope']['soap:Body'][nsPrefix+'getItemsResponse']['return'];
        var itemsStr = JSON.stringify(items);
        console.log("getItems " + itemsStr);
        res.send(itemsStr);
       })
       .catch(function(error){
           console.error(error);
           res.status(500).send({'text':error.Error});
         })
  },// getItems
  newItem: function(config,req,res){
    console.log(JSON.stringify(req.body.item));
  },
  saveItem: function(config,req,res){
    console.log(JSON.stringify(req.body.item));
  },
  getEntries: function(config,req,res){
    let body = '<ws:getInventoryCrossSite/>';
    processRequest(res,config,body).then(function(data) {
        let jsonrepstr = convert.xml2json(data, xml2jsonOptions);
        console.log(jsonrepstr);
        let jsonrep = JSON.parse(jsonrepstr);
        var inventories = jsonrep['soap:Envelope']['soap:Body'][nsPrefix+'getInventoryCrossSiteResponse']['return'];
        var inventoriesStr = JSON.stringify(inventories);
        console.log("getEntries " + inventoriesStr);
        res.send(inventoriesStr);
       })
       .catch(function(error){
           console.error(error);
           res.status(500).send({'text':error.Error});
         })
  },// getEntries
  newInventory: function(config,req,res){
    console.log(JSON.stringify(req.body.entry));
  },
  saveInventory: function(config,req,res){
    console.log(JSON.stringify(req.body.entry));
  },
  getSuppliers: function(config,req,res){
    let body = '<ws:suppliers/>';
    processRequest(res,config,body).then(function(data) {
        let jsonrepstr = convert.xml2json(data, xml2jsonOptions);
        console.log(jsonrepstr);
        let jsonrep = JSON.parse(jsonrepstr);
        var suppliers = jsonrep['soap:Envelope']['soap:Body'][nsPrefix+'suppliersResponse']['return'];
        var suppliersStr = JSON.stringify(suppliers);
        console.log("getSuppliers " + suppliersStr);
        res.send(suppliersStr);
       })
       .catch(function(error){
           console.error(error);
           res.status(500).send({'text':error.Error});
         })
  },// getSuppliers
  newSupplier: function(config,req,res){
    let supplierStr = JSON.stringify(req.body.supplier);
    console.log(supplierStr);
    let xml = convert.json2xml(supplierStr,{alwaysChildren: true});

    let body = '<ws:newSupplier><arg0>' + xml + '</arg0></ws:newSupplier>' ;
    console.log(body);
    processRequest(res,config,body).then(function(data) {
      console.log(data);
    })
    .catch(function(error){
        console.error(error);
        res.status(500).send({'text':error.Error});
      })
  },
  saveSupplier: function(config,req,res){
    console.log(JSON.stringify(req.body.supplier));
  },
}; // exports
