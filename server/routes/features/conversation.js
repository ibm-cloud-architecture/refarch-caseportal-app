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
const express = require('express');
const router = express.Router();
var request = require('request');
const AssistantV1 = require('watson-developer-cloud/assistant/v1');
var odmclient = require('./ODMClient');

/**
Conversation delegates to the Conversation Broker Micro Service.
*/
module.exports = {
  chat : function(config,req,res){
    req.body.context.predefinedResponses="";
    console.log("text "+req.body.text+".")
    // logic to handle WCS response after prompting to user a message
  /*
    if (req.body.context.action === "search" && req.body.context.item ==="UserRequests") {
        getSupportTicket(config,req,res);
    }
  */
    if (req.body.context.action === "recommend") {
        console.log('Calling ODM from Conversation');
          odmclient.recommend(config,req.body.context,res, function(contextWithRecommendation){

            if (config.debug) {
              console.log('Context back to WCS with recommendation: ' + JSON.stringify(contextWithRecommendation));
            }
            req.body.context = contextWithRecommendation;
            console.log('Sending call for WCS');
            sendToWCSAndBackToUser(config,req,res);
          })
          console.log('Done Calling ODM');
    }
    if (req.body.context.action === "transfer") {
        console.log("Transfer to "+ req.body.context.item)
    }

    if (req.body.context.action === undefined) {
        sendToWCSAndBackToUser(config,req,res);
    }

    console.log('Chat finished');
  } // chat
};




function sendToWCSAndBackToUser(config, req, res){
  console.log('send to WCS start');

  //Which Conversation?
  var conversationInfo = {};
  if(req.body.context.convType == 'productRecommendation'){
    conversationInfo = config.watsonAssistant;
  }
  if(req.body.context.convType == 'itSupport'){
    conversationInfo = config.supportConversation
  }

  sendMessage(config,req.body,res,conversationInfo).then(function(response) {
    if (config.debug) {console.log("\n <<< From WCS "+JSON.stringify(response,null,2));}
    response.text="<p>"+response.output.text[0]+"</p>";
    //  support multiple choices response
    if (response.context.action === "click") {
        response.text= response.text+ "<br/><a class=\"btn btn-primary\" href=\""+response.context.url+"\">"+response.context.buttonText+"</a>"
    }
    res.status(200).send(response);
  }).catch(function(error){
      console.error(error);
      res.status(500).send({'text':error.Error});
    });
    console.log('send to WCS end')
}


/*
// Support Ticket
function getSupportTicket(config,req,res){
  ticketing.getUserTicket(config,req.body.user.email,function(ticket){
      if (config.debug) {
          console.log('Ticket response: ' + JSON.stringify(ticket));
      }
      req.body.context["Ticket"]=ticket
      sendToWCSAndBackToUser(config,req,res);
  })
} // getSupportTicket
*/


//Code for extra effort needed for send message
var sendMessage = function(config,message,res,conversationInfo,next){
  console.log('Start send message')

  var conversation = new AssistantV1({
      username: conversationInfo.username,
      password: conversationInfo.password,
      version: conversationInfo.versionDate
    });
  return new Promise(function(resolve, reject){
      if (message.context.conversation_id === undefined) {
          message.context["conversation_id"]=conversationInfo.conversationId;
      }
      if (config.debug) {
          console.log("\n--- Connect to Conversation named: " + conversationInfo.conversationId);
          console.log(">>> to Assistant "+JSON.stringify(message,null,2));
      }
      conversation.message(
          {
          workspace_id: conversationInfo.workspace,
          input: {'text': message.text},
          context: message.context
          },
          function(err, response) {
            if (err) {
              console.log('error:', err);
              reject(null,{'Error': "Communication error with Watson Service. Please contact your administrator"});
            } else {
              if (conversationInfo.usePersistence) {
                  response.context.persistId=message.context.persistId;
                  response.context.revId=message.context.revId;
                  persist.saveConversation(config,response,function(persistRep){
                        response.context.persistId=persistRep.id;
                        response.context.revId=persistRep.rev;
                        console.log("Conversation persisted, response is now: "+JSON.stringify(response,null,2));
                        resolve(response);
                  });
              } else {
                console.log('Done Send Message');

                  resolve(response);
              }
            }
          }
      );
   }); // promise
}
