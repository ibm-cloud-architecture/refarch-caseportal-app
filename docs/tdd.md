# Applying TDD for developing this Angular app
In this tutorial we explain how to use test driven development and tools to develop Angular single page app, using a set of most common user stories like:
* the internal user, Bob, wants to login to the application via his browser so that he can land on the home page
* Bob want to access the different application function from a single home page with tiles to easily select the function.

Angular 4 offers excellent support to do testing of any of its elements such as components, services, directives... It allows simulation of server-side requests and abstraction of the Document Object Model  (DOM), to provide an environment for testing out numerous scenarios. Additionally, Angular's dependency injection allows every component to be mocked and tested in different scopes.

The project was created using `ng new` command so Karma, Jasmine are added automatically and test specs are done for the app component. We can start from there to implement the first user story.
Karma is the test server. It watches for changes in your testing and application files, and when such changes occur, it runs them in a browser and checks for mistakes.
Jasmine is an unit testing framework for JavaScript, to describe tests and expected results.



## TDD for angular component
Let start by the first user story:
```
As a end user, Bob want to access the set of features offered by the portal from a central page, with nice layout with simple navigation, so that he can easily with ambiguity select the function he wants.
```

Which translates into the following development tasks
- develop a unit test to validate a home page components and navigation
- the home page needs to display the four possible high level features: inventory, IT support, customer management, and advisor. We will details those functions later.

### Testing the home.component
For each component develop a `spec.ts` file. The base template is in `app.component.spec.ts`. It uses Jasmine syntax for defining test suite via the `describe()`` method and then tests, or specs, using the `it()` methods. Inside the `it('should do...' () => {})` the anonymous function uses assertion statements to evaluate conditions and matchers for assertions. Below is an example of testing if the app page has a title and a version.
```JavaScript  
  it(`should have as title 'Case Portal' and version`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toContain('Portal');
    expect(app.version).toContain('v0');
  }));
```

The TestBed creates a dynamically-constructed Angular test module that emulates an Angular `@NgModule`. The `TestBed.configureTestingModule()` method takes a metadata object that have most of the properties of an @NgModule.

1. Step 1: create a new component called home using the Angular CLI command: 'ng g component home'. This command will create the template files to start our implementation.

1. Step 2: Starting by the test, we work in the `home.component.spec.ts` where a first test was created by the generator. This test assesses if the component can be created. Here is an extract of the generated code inside the describe content:
 ```JavaScript
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
 ```

 The fixture represents the HTML element, and the first before end creates the TestBed, and the second the component and fixture. For more information on Angular testing read the tutorial at https://angular.io/guide/testing.

1. Step 3: As we want to continuously test out work we will start the test runner with the command:
```
ng test --singleRun=false
```
1. Our second test will verify the presence of a Welcome message with the name of the user:
```JavaScript
it('should have a Welcome message with the user fist name', () => {
    expect(component.title).toContain('Welcome');
    expect(component.title).toContain('Eddie');
});
```
 This test fails !. So... we need to add different things:
 * define what a user is
 * keep user in browser session
 * get a login service to get user information, and later to support authentication.

1. Adding a User.ts class and then add a user field in the home.component:
```JavaScript
export class User {
  email: string;
  firstname: string;
  lastname: string;
  password : string;
  constructor(email: string, fn: string, pwd: string) { // omitted code
  }
}
```

 Add in home.component.ts
 ```JavaScript
 export class HomeComponent {
  user:User = new User('eddie@email.con','Eddie','pwd');
  title:string='Welcome ' + this.user.firstname;
 }
 ```

 Now the test succeed. But we need a login service.

### Add login feature
We need to add a new feature to support login mechanism which return a User and add it to the browser session.

* Using Angular CLI we first create a module: it is good to package feature as module so the code management will be simpler.
```
ng g module features/login
```
* Then add a service
```
ng g service features/login
```

 Okay so we have code template, let add service using TDD: we want to get a User from a login operation:
```JavaScript
fit('should get a user when calling login given username and password', () => {
  const user: User = loginService.login("eddie@email.com","pwd");
  expect(user.firstname).toEqual('Eddie');
});
```
We use the Jasmine `fit` function to focus on this test so we do not need to run all the tests while developing a new function. We need to add the login function in the service, import the user, etc... so the test can compile. In the LoginService add the mockup implementation:

 ```JavaScript
  import { User } from '../../shared/User';

  @Injectable()
  export class LoginService {

    constructor() { }

    login(uname: string, pwd: string): User {
      return new User('eddie@email.con','Eddie','pwd');
    }
  }
 ```
Service test succeed but we need to get the user injected in the home page. To do so we add the login service as private argument of the home component. As service is @Injectable it will be accessible to the home page.

  ```javascript
  export class HomeComponent {
    user:User;
    title:string;
    constructor(private loginService) {
      this.user = loginService.getCurrentUser();
      this.title = 'Welcome ' + this.user.firstname;
    }
  }
  ```
Oops the home test fails now... with an error like
```
	Error: No provider for LoginService!
```
To fix this issue we need to import the LoginService in `home.component.spec.ts` and then configure the TestBed to inject it via the **providers** list:

  ```json
     declarations: [
          HomeComponent
        ],
        providers: [
          LoginService
        ]
  ```
The test succeed, but this is not perfect, because we are dragging the login component into the home component test. When the login component will have the code for making remote calls via HTTP our home tests will be impacted.
* Adding mockups  
We need to mockup the login service.
Jasmine offers capabilities to develop stub, mockups. So let add a loginStub and use jasmine create spy object API to specify we want to support the getCurrentUser method and return our test user as:

  ```JavaScript
  let loginStub;

  beforeEach(async(() => {
    loginStub = jasmine.createSpyObj('loginStub', ['getCurrentUser']);
    loginStub.getCurrentUser.and.returnValue(new User('eddie@email.con','Eddie','pwd'));
    // ...
  }))
  ```
modify the providers list now
```
providers: [
  { provide: LoginService, useValue: loginStub }
]
```
* Adding more tests to login component
The login component is to get username as email address and password with a minimum of constraints like length and special characters. In the login.component.spec.ts let add user name to be a mandatory field. To do that we use the Angular **By** feature, to access HTML element using their CSS id. and then we use a special input type with validation rule.
  ```
  it('should have username as mandatory field', () => {
      const userNameElement = fixture.debugElement.query(By.css(('#usernameInput')));
      // the requirement is not on the input as html element attribute but in validation rule
      const componentInstance = userNameElement.componentInstance;
      expect(componentInstance.validations[0].type).toEqual('required');
    });
  ```
For the custom input element and validation rule see [the explanations in this article](./angularhowtos/custominput.md). In the HTML page we need to add the input for the username and password and then the model element in the component. The code is self explanatory and we are providing some details in [this note](./angularhowtos/loginui.md)

@@@ stopped here!  
Angular Mocks is an Angular module that is used to mock components that already exist in the application. Its role is to inject various components of the Angular application (controllers, services, factories, directives, filters) and make them available for unit tests.


## Consumer Driven Contract
To develop the service interface, we are using the [consumer driven contracts]() pattern introduced by Martin Fowler to develop tests for each operation the user interface will reach, and define contract (HTTP verb, url, error reporting and data payload schema) from a consumer needs so the provider can support it. It is like applying customer focus practice to service development.
Using [Pact](https://docs.pact.io/) from Pact Foundation, is a nice framework to define and test contracts. The major advantage is to split the tests into consumer and provider tests. Each tests run against mockup so it is easy to keep development in synch but not by dragging a lot of component and integration during the development and TDD phases. Both consumer and provider mocks access the same contract.


### Use Pact into Angular test
We need to include following dependencies into devDependencies of the package.json:
```
  "@pact-foundation/karma-pact": "2.1.3",
  "@pact-foundation/pact": "^5.5.0",
  "@pact-foundation/pact-node": "6.7.4",
  "@pact-foundation/pact-web": "5.3.2",
```
* Pact-node helps to run mock provider and create contract files.
* Karma-pact is a Karma plugin that launches the mock provider before running actual tests.
* PackWeb is used to define contracts as Interaction and send the HTTP request, to a pack-node server.

Then we need to configure Karma to use Pact node by defining which port to start the mock server, and proxy rule to route url to the mock provider.
```
pact: [
    {
      consumer: 'Case Portal UI',
      provider: 'Inventory Service',
      port: 1234,
      log: process.cwd() + '/out/logs/pact/pact-tests-inventory.log',
      dir: process.cwd() + '/out/pact',
      logLevel: 'WARN',
      spec: 2
    },
]
proxies: {
  ''
    }

```


## Future readings
* https://angular.io/guide/testing
* https://reflectoring.io/consumer-driven-contracts-with-angular-and-pact/
