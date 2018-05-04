# Back end For Front end
The BFF pattern was introduced to support multiple user interface client for the same business logic in a context of microservice architecture: with JEE application the services are part of the web app which serves the rendering pages. With single page application, and microservice based on REST API the components are separated and follow different devops life cycle. Also the granularity of the APIs is different than what the clients needs. Clients may need to aggregate data from different sources before responding to the web browser. Mobile Apps may have different needs than desktop apps. Service granularity and URL location changes dynamically and this should be hidden from clients. With SOA the API gateway pattern was used as part of the ESB, and offers centralized deployment of the client APIs. Now with microservice there is less of a need to have this central orchestration layer, and still the API gateway is needed, it becomes one API gateway per client, a backend for frontend.

With BFF the clients are insulated from the microservices partionning, where the microservice runs. It also deliver optimal API for each client, in term of data model, number of calls, payload content, simplified protocol.
So BFF is not just an API gateway it also support the business logic for the client code. It is part of the application, and serves application specific business object (ASBO) for the presentation model. A typical ASBO will be a CustomerProfile object which includes data point coming from different datasource. At the user interface level, the model will be a view of this ASBO. This view is created by the BFF.

Things to consider when implementing BFF:
* if the BFF is becoming just an API url proxy you may not need it anymore
* BFF should have business logic for the client scope.
* business logic for the service is in other backend service. The separation of the business logic has to be assessed continuously when implementing new business requirements.
* when same code are duplicated inside different BFF, this code is an excellent candidate for its own separate microservice.
* Model mapping should be done in the BFF
