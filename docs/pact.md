# Pact

## Install locally
We will use the docker images to run postgresql and Pact broker. To persist contract and statistics Pact is using by default the Postgresql DB.
### clone the pact container repository:
```
git clone https://github.com/DiUS/pact_broker-docker.git
cd pact_broker-docker
```

To get a Postgresql up and running on a Mac for example:
```
# create a folder where you will persist the data
mkdir data
# Start postgres container named pactbroker-db and mounting your
docker run --name pactbroker-db -e POSTGRES_PASSWORD=admin -e POSTGRES_USER=admin -e PGDATA=/var/lib/postgresql/data/pgdata -v ./data:/var/lib/postgresql/data -d postgres

```
The previous command starts postgress server, do some initialization and listen on port 5432. Once done we use the psql tool to create database instance. To start the psql command line interface use the docker command:

```
docker run -it --link pactbroker-db:postgres --rm postgres sh -c 'exec psql -h "$POSTGRES_PORT_5432_TCP_ADDR" -p "$POSTGRES_PORT_5432_TCP_PORT" -U admin'
```

Then create the database:
```
admin=# CREATE USER pactbrokeruser WITH PASSWORD 'pactpwd';
CREATE ROLE
admin=# CREATE DATABASE pactbroker WITH OWNER pactbrokeruser;
CREATE DATABASE
admin=# GRANT ALL PRIVILEGES ON DATABASE pactbroker TO pactbrokeruser;
GRANT
\q
```

Start Pact broker
```
$ docker run --name pactbroker --link pactbroker-db:postgres -e PACT_BROKER_DATABASE_USERNAME=pactbrokeruser -e PACT_BROKER_DATABASE_PASSWORD='pactpwd' -e PACT_BROKER_DATABASE_HOST=postgres -e PACT_BROKER_DATABASE_NAME=pactbroker -d -p 80:80 dius/pact-broker
```


### Install Pack Broker on ICP
1. From ICP catalog install **ibm-Postgresql** helm chart using the following parameters:
  * Helm release name: brown-postgress  under the namespace browncompute
  * DB name: postgres,
  * username: postgres
  * test command: psql postgres --command "select 1" -U postgres
  * port number: 5432
  * dynamic volume provisioning
  * NodePort exposure

At the high level, for the consumer side you develop a test script which defines the contract.  


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
