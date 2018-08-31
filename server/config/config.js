
var config = require('./config.json');
var apiUrl= config.secureGateway.url;
if (config.environment === "private") {
  apiUrl= config.apiGateway.hostUrl;
}


module.exports = {
  getLoginUrl : function(){
    return apiUrl+config.apiGateway.url+"/login";
  },
  getGatewayUrl:function(){
      return apiUrl+config.apiGateway.url;
  },
  getAPICClientId : function(){
    return config.apiGateway.xibmclientid;
  },
  getMode: function(){
    return config.mode;
  },
  getConversationBrokerUrl : function(){
    return config.conversationBroker.url;
  },
  getPort : function(){
    return config.port;
  },
  getVersion : function(){
    return config.version;
  },
  getAdvisorBrokerUrl : function(){
    return config.advisorBroker.url;
  },
  getCustomerAPIURL : function(){
    return config.customerAPI.url;
  },
  getCustomerAPIHost : function(){
    return config.customerAPI.host;
  },
   getInventoryUrl:function(){
      return apiUrl+config.inventory.url;
  },

  getInventoryDAL: function() {
    return config.inventoryDAL.hostUrl + config.inventoryDAL.url;
  }

}

module.exports.supportConversation = config.supportConversation;
module.exports.watsonAssistant = config.watsonAssistant;
module.exports.odm = config.odm;
