# Applying TDD for developing this Angular app
In this tutorial we explain how to use test driven development and tools to develop Angular single page app, using a set of most common user stories like:
* the internal user, Bob, wants to login to the application via his browser so that he can land on the home page
* Bob want to access the different application function from a single home page with tiles to easily select the function.

Angular 4 offers excellent support to do testing of any of its elements such as components, services, directives... It allows simulation of server-side requests and abstraction of the Document Object Model  (DOM), to provide an environment for testing out numerous scenarios. Additionally, Angular's dependency injection allows every component to be mocked and tested in different scopes.

The project was created using `ng new` command so Karma, Jasmine are added automatically and test specs are done for the app component. We can start from there to implement the first user story.
Karma is the test server. It watches for changes in your testing and application files, and when such changes occur, it runs them in a browser and checks for mistakes.
[Jasmine](https://jasmine.github.io/) is an unit testing framework for JavaScript, to describe tests and expected results.

## TDD for angular component
We strongly recommend to study [this tutorial](https://angular.io/guide/testing) and this article about [TDD tutorial](https://www.ibm.com/cloud/garage/tutorials/introduction-to-test-driven-development)

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

### Add logout and home navigation in header
So we want to validate there is a logout hyper link and clicking on it move the route to login page.
To do so we need to have the RouterTesting imported in the spec:
```javascript
imports: [
    RouterTestingModule.withRoutes([])
]
```
Then write the test taking the logout HTML element using an id, and then clicking on the link and wait for the event propagation.

```javascript
it('should go to logout url when clicking on logout link', () => {
  const link = fixture.nativeElement.querySelector('#logout-link');
  link.click();
  fixture.whenStable().then(() => {
      const routerService = TestBed.get(Router);
      expect(routerService.navigate.calls.any()).toBe(true, 'navigate called');
  })
});
```

The html looks like
```html
  <li><a id='logout-link' (click)="logout">Logout</a></li>
```

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
 it('should get a user when calling login given username and password', () => {
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
The test succeed, but this is not perfect, because we are dragging the login component into the home component test. When the login component will have the code for making remote calls via HTTP our home tests will be impacted. We need to mockup the login service.

* Adding mockups  
Jasmine offers capabilities to develop stub, mockups. So let add a loginStub and use jasmine create spy object API to specify we want to support the getCurrentUser method and return our test user as illustrated below:

  ```JavaScript
  let loginStub;

  beforeEach(async(() => {
    loginStub = jasmine.createSpyObj('loginStub', ['getCurrentUser']);
    loginStub.getCurrentUser.and.returnValue(new User('eddie@email.con','Eddie','pwd'));
    // ...
  }))
  ```
modify the providers list now by referencing the stub:
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
For the custom input element and validation rule see [the explanations in this article](./angularhowtos/custominput.md). In the HTML page we need to add the input for the username and password and then the model element in the component. The code is self explanatory and we are providing some details in [this note](./login/README.md)

### Testing with HostComponent
When developing lower level component that is included in other page, we can use the concept fo 'host' component in the test and play with it. As an example, we want to define a Tile element that will represent a reusable control with title, short description and a button to route to another internal element. It will be used in the homw page to access the list of features. The Tile has input elements. Once the Tile component is added with 'ng g component shared/tile' command we can start by the test and add a Host component:
```JavaScript
describe('TileComponent', () => {
  let component: TileComponent,
    router: Router;
  let fixture: ComponentFixture<HostComponent>;

  @Component({
      template: '<app-tile title="Some title" description="Some message." color="red"></app-tile>'
  })
  class HostComponent {}
})
```
Be sure to declare the HostComponent in the TestBed module:
```JavaScript
describe('TileComponent', () => {
  let component: HostComponent,
    router: Router;
  let fixture: ComponentFixture<HostComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
          RouterTestingModule.withRoutes([])
      ],
      declarations: [ HostComponent ]
    })
    .compileComponents();
  }));
})
```
Then we create an instance and validate the parameters are set:
```JavaScript
  fixture = TestBed.createComponent(HostComponent);
  it('should contain style with red color', () => {
        const tile = fixture.debugElement.query(By.css('#firstTile'));
        const tileComponent = tile.componentInstance;
        expect(tileComponent.color).toBe('red');

  });
```

### Testing Service doing http calls
The LoginService includes HTTP call to the BFF server. To avoid doing test to remote server in Jasmine unit test, Angular offers a HttpClientTestingModule module that needs to be imported in the service tests. One of the module class is the
[HttpTestingController](https://angular.io/api/common/http/testing/HttpTestingController) which allows for mocking and flushing of requests. In the test below the approach is to test login function and verify the user is returned. So using the controller mockup we can verify the login URL is called, the request is a POST , and return a response with the expected data.

```JavaScript
httpMock = TestBed.get(HttpTestingController);
// ..
it('should get a user when calling login given username and password', () => {
    let user: User;
    loginService.login("eddie@email.com","pwd").subscribe(
      user => {
          expect(user.firstname).toEqual('Eddie');
      },
      err => {
        fail('Unexpected error: ' + err);
      });
      const req = httpMock.expectOne(loginService.loginUrl);
      expect(req.request.method).toEqual('POST');
      req.flush({firstname: "Eddie", email: "eddie@email.com"});
});

```
From this test we can implement the function. The back end is returning a User data which we need to keep in session so page can access common data element like firstname or jwtToken. The SessionStorage is used for that.

We will use the jasmine spy method. So when there is a call on setItem on the sessionStorage, instead of using the window's one, we can use a mockSessionStorage object.

```
spyOn(window.sessionStorage, 'setItem')
  .and.callFake(mockSessionStorage.setItem);
```
We recommend to go over the login.service.spec.ts file now that the main concepts are introduced.

## Testing how to
### Testing clicking a button


## Future readings
* https://angular.io/guide/testing
* https://programmingcroatia.wordpress.com/2017/09/22/angular-2-jasmine-testing/
* https://reflectoring.io/consumer-driven-contracts-with-angular-and-pact/
*
