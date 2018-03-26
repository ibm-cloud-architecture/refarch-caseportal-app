# Applying TDD for developing this Angular app
In this tutorial we explain how to use test driven development and tools to develop Angular single page app, using a set of most common user stories like:
* the internal user, Bob, wants to login to the application via his browser so that he can land on the home page
* Bob want to access the different application function from a single home page with tiles to easily select the function.

Angular 4 offers excellent support to do testing of any of its elements such as components, services, directives... It allows simulation of server-side requests and abstraction of the Document Object Model  (DOM), to provide an environment for testing out numerous scenarios. Additionally, Angular's dependency injection allows every component to be mocked and tested in different scopes.

The project was created using `ng new` command so Karma, Jasmine are added automatically and test specs are done for the app component. We can start from there to implement the first user story.
Karma is the test server. It watches for changes in your testing and application files, and when such changes occur, it runs them in a browser and checks for mistakes.
Jasmine is an unit testing framework for JavaScript, to describe tests and expected results.

## Code Structure
The src includes the following folders for better code management:
* **core** folder for: All services which have to have one and only one instance per application (singleton services) should be implemented here.
* **shared**: All the “dumb” components and pipes should be implemented here. These components don’t import and inject services from core or other features in their constructors. They should receive all data though attributes in the template of the component using them.
* **features**: all business logic/ UI controller and services to implement the different app features.

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
    expect(app.title).toEqual('Case Portal');
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

1. Add missing pieces: First we add a User.ts class and then add a user field in the home.component:
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
So we need to add a new feature to support login and add the user to browser session.

1. Using Angular CLI we first create a module: it is good to package feature as module so the code management will be simpler.
```
ng g module features/login
```
Then add a service
```
ng g service features/login
```

 Okay so we have code template let add service using TDD: we want to get a User from a login operation:
```JavaScript
fit('should get a user when calling login given username and password', () => {
  const user: User = loginService.login("eddie@email.com","pwd");
  expect(user.firstname).toEqual('Eddie');
});
```
We use the Jasmine `fit` function to focus on this test so we do not need to run all the tests while developing a new function. We need to add the login function in the service, import the user, etc... so the test can compile:
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
```JavaScript
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
To fix this issue we need to import the LoginService in `home.component.spec.ts` and then configure the TestBed to inject it via the providers list:
```json
   declarations: [
        HomeComponent
      ],
      providers: [
        LoginService
      ]
```
The test succeed, but this is not perfect, because we are dragging the login component into the home component test. When the login component will have the code for making remote calls via HTTP our home tests will be impacted. We need to mockup the login service.
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


Angular Mocks is an Angular module that is used to mock components that already exist in the application. Its role is to inject various components of the Angular application (controllers, services, factories, directives, filters) and make them available for unit tests.


## Consumer driven Contract
To develop the service interface, we are using the consumer driven contract pattern introduced
## Future readings
* https://angular.io/guide/testing
