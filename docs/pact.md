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
