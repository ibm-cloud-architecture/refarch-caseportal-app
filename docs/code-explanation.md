# Code explanation
Most of the interactions the user is doing on the Browser are supported by [Angular 2](http://angular.io) javascript library, with its Router mechanism and the DOM rendering capabilities via directives and components. When there is a need to access data from one of on-premise servers, or use public service an AJAX call is done to the server, and  the server will respond asynchronously later on. The components involved are presented in the figure below in a generic way

![Angular 2 App](docs/ang-node-comp.png)
To clearly separate codebases for front- and back-ends the `src` folder defines the angular 2 code while the `server` folder includes the REST api for front end implemented with expressjs and javascript.

## Angular app
The application code is under the client folder, and follows the standard best practice for Angular 2 development:
* unique index.html to support single page application
* use of modules to organize features
* use of component, html and css per feature page
* encapsulate calls to back end for front end server via service components

### Code structure
The src includes the following folders for better code management:
* **core** folder for: All services which have to have one and only one instance per application (singleton services) should be implemented here.
* **shared**: All the “dumb” components and pipes should be implemented here. These components don’t import and inject services from core or other features in their constructors. They should receive all data though attributes in the template of the component using them.
* **features**: all business logic/ UI controller and services to implement the different app features.

### Some specifics features
#### [Login](./login/README.md)

#### Home page
The home page layout is to present a set of tile per major features. To do we have added a tile component in the shared folder and then use it in the home page. Here is an example on how to use it:
```
  <app-tile [color]="'#8c4507'" [title]="'Inventory Plus'" [description]="'Manage product inventory and suppliers'" [buttonName]="'Inventory Plus'" [urlPath]="'inventory'"></app-tile>
```

The tile uses the angular input and output function to control the attribute.

#### Inventory Management

For the inventory the component in client/app/inventory folder use a service to call the nodejs / expressjs REST services as illustrated in the code below:  

```javascript
export class InventoryService {
  private invUrl ='/api/i';

  constructor(private http: Http) {
  };

  getItems(): Observable<any>{
    return this.http.get(this.invUrl+'/items')
         .map((res:Response) => res.json())
  }
}
```
The http component is injected at service creation, and the promise returned object is map so the response can be processed as json document.

An example of code using those service is the inventory.component.ts, which loads the inventory during component initialization phase.

```javascript
export class InventoryComponent implements OnInit {

  constructor(private router: Router, private invService : InventoryService){
  }

  // Uses in init to load data and not the constructor.
  ngOnInit(): void {
    this.getItems();
  }
}
```

For detailed on the Angular 2 code see [this note](docs/userinterface.md)
## Server code
The application is using nodejs and expressjs standard code structure. The code is under *server* folder. The inventory API is defined in the server/routes/feature folder and uses request library to perform the call to the Secure Gateway public API combined with the Inventory API secure gateway. The env.json

```javascript
const config = require('../env.json');
const apiUrl=config.secureGateway.url+config.apiGateway.url+"/items";

router.get('/items', function(req,res){
  console.log("In inventory get all the items from the exposed api");
  var h = {
    'X-IBM-Client-Id': config.apiGateway.xibmclientid,
    'Accept': 'application/json',
    'Authorization': 'Bearer '+req.headers.token
  }
  request.get(
      {url:apiUrl,
      timeout: 5000,
      headers: h
      },
      function (error, response, body) {

      }
     );

});

```

## Adding other features
The portal application includes a simple chat bot integration to ask IT support related questions by using Watson Conversation. The approach is detailed in [cognitive compute conversation code](https://github.com/ibm-cloud-architecture/refarch-cognitive-conversation-broker). In the context of this application to enable this capability you need to do the following:
* Have you own copy of the Conversation Broker project
* Add a new Watson conversation service in your IBM Cloud space and develop the Conversation artifacts.
* Reference your IBM Cloud Watson Conversation service into the conversation broker
* Deploy the broker to IBM Cloud
* Modify the env.json to reference the broker URL
* Enable the user interface to present the feature access by setting the mode to cyan in env.json
```
    "mode" : "cyan"
```
For the conversation demo script please refers to this [node](https://github.com/ibm-cloud-architecture/refarch-cognitive-conversation-broker/blob/master/doc/demoflow.md)
