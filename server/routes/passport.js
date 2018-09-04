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

var LocalStrategy = require('passport-local').Strategy;

var request = require('request').defaults({strictSSL: false});

var path = require('path');
var querystring = require('querystring');

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
        passReqToCallback : true, // allows us to pass back the entire request to the callback
        // specify the attribute name to consider is you are not using default  username, password
        usernameField: 'userName',
		    passwordField: 'password'
    },
      function( req, username, password, done) {
        //process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        var user = { username:username,password:password,email:username}
        var builtUrl=config.apiGateway.url+"/login?"+querystring.stringify(user);
        var options={
          uri: builtUrl,
          method: 'GET',
          rejectUnauthorized: true,
          headers: {
            'X-IBM-Client-Id': config.apiGateway.xibmclientid,
            'Accept': 'application/json',
            'Content-Type' : 'application/x-www-form-urlencoded'
          }
        }
        console.log('Login call '+username+ " options "+ JSON.stringify(options));
        // bypass for certain users to simplify the demo
        if ( "bobbuilder@email.com" === username
            || "eddie@email.com" === username
            || "jane@email.com" === username ) {
          user.access_token = "1234567";
          user.firstname = password;
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
