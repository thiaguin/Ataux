# Backend

## Description

This is as basic project to improve my skills. It's an API to serve the frontend simulating an e-commerce website.
<br/>
The main tools used in this project:

-   [Typescript](https://www.typescriptlang.org/): The language adopted
-   [NestJS](https://nestjs.com/): A framework to make the server more efficient, reliable and scalable
-   [Docker](https://www.docker.com/): To containerize the database
-   [Postgres](https://www.postgresql.org/): A object-relational database thats use SQL
-   [Typeorm](https://typeorm.io/#/): The ORM to facilitate the creation and the queries on database

## Prerequisites

-   Docker
-   docker-compose
-   Nodejs >= v12.18.0

## Installation

```bash
# To create the database
$ docker-compose up --no-start


# To install dependecies
$ npm install
```

### Restore database backup (Optional)

```bash
# To install dependecies
$ cat backup.sql | docker exec -i e-postgres psql -U e-username -d test
```

## Start database

```bash
# To install dependecies
$ docker-compose start
```

## Setting enviroment variables

To run the project is required to set the following enviroment variables

``` bash
DB_HOST # The host where the database is running
DB_PORT # The port where the database is running on host
DB_USERNAME # The database username to login
DB_PASSSWORD # The database login password
DB_NAME # The database name
SECRET # The secret used to make the user authentication
SIZE # The size required to generate the password
GOOGLE_CLIENT_ID # The google cliente id to make the login by google
EMAIL # The user email who will send the emails
PASSWORD # The password credential of user email
FRONTEND_URL # Where the frontend url is running
```
## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test (WIP)

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

[MIT](LICENSE).
