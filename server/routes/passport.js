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
 */
//passport.js
var LocalStrategy = require('passport-local').Strategy;

var request = require('request').defaults({strictSSL: false});
//var request = require('request');
// var https=require('https');
// var fs = require('fs');
var path = require('path');
//var config = require('./env.json');
var querystring = require('querystring');
//var caCerts =fs.readFileSync(path.resolve(__dirname, '../../ssl/ca.all.crt.pem'));

//var apiUrl=config.secureGateway.url+config.apiGateway.url+"/login";

module.exports = function(passport,config) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    passport.use('local', new LocalStrategy({
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
      function(req, username, password, done) {
        //process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        var user = { username:username,password:password,email:username}
        var builtUrl=config.getLoginUrl()+"?"+querystring.stringify(user);
        var options={
          uri: builtUrl,
          method: 'GET',
          rejectUnauthorized: true,
          headers: {
            'X-IBM-Client-Id': config.getAPICClientId(),
            'Accept': 'application/json',
            'Content-Type' : 'application/x-www-form-urlencoded'
          }
        }
        console.log('Login call '+username+ " options "+ JSON.stringify(options));
        if ( "tester" === username
            || "bobbuilder@email.com" === username
            || "eddie@email.com" === username
            || "jane@email.com" === username ) {
          done(null,user)
        } else {
          request(options, function(error, response, body){
            if(error){
              console.error('ERROR CONTACTING LOGIN API', error);
              return done(error);
            }
            console.log('Login body:', JSON.stringify(body));
            if (body.httpCode == 500) {
              console.log("Server error");
              return done(error)
            }
            return done(null, body);
          })
        }

      }
    ));
};
