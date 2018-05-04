# Login implementation
This article addresses in detail how login is supported in the Case Inc Portal by using different practices for service encapsulation, OAuth, API authorization, on-premise LDAP integration, and the use of passport.js expressjs middleware.

## Table of contents
* [Requirements to support](#requirements)
* [API definition for login](#api-definition)
* [Server code](#bff-server-login-proxy)
* [Client code](#web-client-side)

## Requirements
We want to support the following requirements:
* The portal application has a login page to get email and password then once authenticated the user is routed to a home page where he can access a set of business functions.
* Userid and password are persisted in a LDAP server running on-premise
* The authentication is supported by adding an API (/login), on the API Connect server running on-premise
* The returned response from this authentication service is a Oauth access token that will be used as authorization Bearer token to any call to the back end services like the *inventory API*.
* The BFF server exposes APIs for the user interface which can to be accessible only if the user is previously authenticated

## API definition
A new url path is added to the IBM API Connect *inventory* product to support "/login", as illustrated in figure below:
![](api-login-path.png)  
Classical username / password input. Here is the choice was to use query parameters, but it will be the same to use a JSON object in the body payload.

The logic to support this API has to do a call to the LDAP server and do some data transformation using XSLT to deliver a Oauth token. Below the flow diagram in API Connect  illustrates this logic:  
![](api-login-assemble.png)  

The XSLT transformation is executed on the API Gateway appliance.

When deployed on IBM Cloud the web application accesses the login URL via the IBM Secure Gateway running on IBM Cloud (cap-sg-prd-5.integration.ibmcloud.com). The URL will be in the form of: https://cap-sg-prd-5.integration.ibmcloud.com:16582/csplab/sb/sample-inventory-api/login?username=<>&password=<>
When deployed to IBM Cloud Private the URL end point is the one exposed by API gateway.

The returned object is a Json object with access token like below:
```Json
{
"token_type": "bearer",
"access_token": "AAEkNWuxlNl......",
"expires_in": 3600,
"scope": "scope1"
}
```
The access token is used as authorization attribute inside the HTTP header, we will detail that later.

Once the login mechanism is in place all other APIs defined in the `Inventory product` are secured: in API connect management, the option `Use API security definitions` is checked for each API exposed, like the `/items`:
![](api-security.png)  

And the Security definition specifies what to use: the oauth, X-IBM-Client-Id, and scope options.  
![](api-security-reqs.png)  


## [BFF](../bff.md) Server login proxy
On the web server side we are using [Passport.js](http://www.passportjs.org/) to simplify the express.js middleware management. The package.json includes the dependency to get the passport.js.

In the server we need to import passport and specify that the workload will be parsed from the http body part. To do so we need to add body parser and set the Type

```javascript
const passport = require('passport');
const bodyParser =   require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// configure the passport strategy, specifying the login end point from the config
var config = require('./config/config');
require('./routes/passport')(passport,config)
```
The **passport** variable is passed to the authentication module we named routes/passport

The other component to add to the nodejs server is the **userlogin.js**  which exposes the two URLs needed to support authentication and logout.
```
require('./routes/userlogin')(app, passport);
app.use(passport.initialize());
app.use(passport.session())
```
`passport.initialize()` middleware is required to initialize Passport and as our application uses persistent login sessions, `passport.session()` middleware must also be used.

Before asking Passport to authenticate a request, the strategy used by our application must be configured to inject end point URL from **config** object and overwrite the local strategy by calling the remote authentication API we defined in API Connect. The config object helps us to control end points according to the deployment target: IBM Cloud or IBM Cloud Private.

The code in routes/passport.js defines the Strategy and what to do with input data. The first argument for the strategy constructor is an option json object to specify for example the attribute name to consider is you are not using default  username, password, or to pass the entire request to the `done` callback.

```javascript
passport.use('local', new LocalStrategy({
    passReqToCallback : true, // allows us to pass back the entire request to the callback
    usernameField: 'userName',
    passwordField: 'password'
},
  function(req, username, password, done) {
    var user = { username:username,password:password}
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
    request(options, function(error, response, body){
      if(error){
        console.error('ERROR CONTACTING LOGIN API', error);
        return done(error);
      }
      if (body.httpCode == 500) {
        console.log("Server error");
        done(error)
      }
      return done(null, body);
    })
  }
));

```
This is the code you may want to change to adopt another strategy or end point.

Finally we need to specify the URL end point (**/bff/login**) to process the login request from the Angular client. This is done in `routes/userlogin.js` code.

```javascript
app.post('/bff/login', passport.authenticate('local'), function(req, res){
  console.log('User Authenticated Successfully:', req.user)
  res.status(200).send(req.user);
})
```

Authenticating requests is as simple as calling passport.authenticate() and specifying which strategy to use. Here it uses 'local'. The function as parameter will be called if the authentication is successful. The req.user includes the authenticated user.
After successful authentication, Passport will establish a persistent login session.

When the client hits /login, passport.authenticate('local') middleware is ran, which triggers the following function which will make the call to the login api, using the username/password combo, and return the user's auth token along with some other information. Upon receipt of that info, it continues execution of the original app.post('/login') function, with user injected into the req so it can be accessed via req.user.

At this point, passport serialized the user so now the users info (the simple object which contains the access token and looks like the following) will be injected into every api call's req object. this is all kept track of by passport via cookies, so we don't have to worry about it anymore
```json
{
  "token_type":"bearer",
  "access_token":"TOKEN_STRING_HERE",
  "expires_in":3600,
  "scope":"scope1"
}
```

Now, to actually use our new authentication method to protect the endpoints, we simply add a middleware function to check for the existence of req.user. if it exists, user is logged in and is authenticated, if not, they are not and do not have access, so we stop them from proceeding and will return a status code of 401 to the client, which should prompt them to log in (or in our case currently, redirect them to the login page)

```javascript
// api.js
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){ //isAuthenticated is implemented for us via passport
      return next();
    }
    //not authenticated, so send status of 401 and message telling them they're unauthenticated
    res.status(401).send('unauthenticated');
}
// ...
app.get('/api/i/items', isLoggedIn, (req,res) => {
  //this code will ONLY happen if isLoggedIn calls next() which will run this function,
  //so if this ever runs, the user is logged in.
  inventory.getItems(req,res);
})
```

To logout, we just need to call the passport logout function and destroy the session:
```javascript
// userlogin.js
app.get('/bff/logout', function(req, res){
  req.logout();
  req.session.destroy(function (err) {
      res.status(200).send({loggedOut: true});
  });
})
```

For other call, like getting the items from the inventory back end service, each function in inventoryProxy.js are getting the create JWT token from the serialized user. The passport module already injected the serialized user for us, so we do not need to send the user in HTTP header between client and server

```javascript
getItems : function(req,res){
  var user = JSON.parse(req.user)
  var opts = buildOptions(user.access_token,'GET',config.apiGateway.url+'/items');
  processRequest(res,opts);
},// getItems
```


## Web Client Side
The login is supported by a specific Angular module with a route based on the url `#/login`. In `routing.module.js` the Login component declaration is added, with the route definition.
Each other internal routes are access protected if the user is not logged in. This is done by using the LoginGuard service. So each route definition is active if the user was authenticated before.

```javascript
import { LoginComponent }  from './login/login.component';
import { LoginGuard }       from './login/login.guard';

 // ...
const routes: Routes = [
  { path: 'home', component: HomeComponent ,canActivate: [LoginGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'inventory', component: InventoryComponent, canActivate: [LoginGuard]},
],
// ...
@NgModule({
    declarations: [
    LoginComponent],
    providers: [LoginGuard]
})
```  

The login guard is used to prevent unauthenticated users from accessing restricted routes, it assesses if the user is logged by using the authentication service:
```javascript
export class LoginGuard implements CanActivate {

    constructor(private router: Router, private authService: LoginService){ }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean  {
      return this.authService.authenticated()
        .map((result) => {
            if (result.authenticated) {
              return true;
            } else {
              return false;
            }
        })})}
```

The second change in LoginService that is meaningful is the addition of the following function:
```javascript
authenticated() {
  return this.http.get('/api/authenticated', <RequestOptionsArgs>{ withCredentials: true })
    .map((res: Response) => res.json())
}
```

From the login.guard, we now will use this function to hit a new api endpoint which will simply let us know if the user is logged in or not, therefore allowed to access the page protected by this guard.

## SSL
When deploying this webapp to IBM Cloud public, the communication between the nodejs web server, IBM secure gateway and API Connect gateway running on premise is using SSL. As it is little bit complex we have create a [separate note](ssl.md) to explain what we did to make this communication working.
