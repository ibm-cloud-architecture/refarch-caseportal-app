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
var persist = require('./persist');
var ticketing = require('./ticketingClient');
var toneAnalyzer = require('./toneAnalyzerClient');
var churnScoring = require('./WMLChurnServiceClient');
var odmclient = require('./ODMClient');

/**
Conversation delegates to the Conversation Broker Micro Service.
*/
module.exports = {
  chat : function(config,req,res){
    req.body.context.predefinedResponses="";
    console.log("To WCS ->: "+req.body.text+".")
    // logic to handle WCS response after prompting to user a message

    if (req.body.context.toneAnalyzer && req.body.text !== "" ) {
      analyzeTone(config,req,res)
    }
    if (req.body.context.action === "search" && req.body.context.item ==="UserRequests") {
      getSupportTicket(config,req,res);
    }
    if (req.body.context.action === "recommend") {
        console.log('Conversation is asking for a product recommendation -> delegate to ODM');
          odmclient.recommend(config,req.body, function(contextWithRecommendation){
            // no more need to got back to WCS sendToWCSAndBackToUser(config,req,res);
            contextWithRecommendation.output  = {"text": []};
            res.status(200).send(contextWithRecommendation);
          })
    }
    if (req.body.context.action === "transfer") {
        console.log("Transfer to "+ req.body.context.item)
    }

    if (req.body.context.action === undefined) {
        sendToWCSAndBackToUser(config,req,res);
    }

    console.log('Interaction finished');
  } // chat
};


// ------------------------------------------------------------
// Private
// ------------------------------------------------------------
/*
Call tone analyzis and when the tone assessment is frustrated call scoring services
Call WCS back
**/
function analyzeTone(config,req,res){
  toneAnalyzer.analyzeSentence(config,req.body.text).then(function(toneArep) {
        if (config.debug) {console.log('Tone Analyzer '+ JSON.stringify(toneArep));}
        var tone=toneArep.utterances_tone[0].tones[0];
        if (tone !== undefined && tone.tone_name !== undefined) {
          req.body.context["ToneAnalysisResponse"]=tone;
          if (tone.tone_name === "Frustrated") {
            churnScoring.scoreCustomer(config,req,function(score){
                      req.body.context["ChurnScore"]=score;
                      sendToWCSAndBackToUser(config,req,res);
                })
          } else {
            sendToWCSAndBackToUser(config,req,res);
          }// frustrated
        } else {
          req.body.context["ToneAnalysisResponse"]={}
          sendToWCSAndBackToUser(config,req,res);
        }

  }).catch(function(error){
      console.error(error);
      res.status(500).send({'msg':error.Error});
    });
} // analyzeTone

function getSupportTicket(config,req,res){
  ticketing.getUserTicket(config,req.body.user.email,function(ticket){
      if (config.debug) {
          console.log('Ticket response: ' + JSON.stringify(ticket));
      }
      req.body.context["Ticket"]=ticket
      sendToWCSAndBackToUser(config,req,res);
  })
} // getSupportTicket


function sendToWCSAndBackToUser(config, req, res){
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
}


//Code for extra effort needed for send message
var sendMessage = function(config,message,res,conversationInfo,next){

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
                  resolve(response);
              }
            }
          }
      );
   }); // promise
}
