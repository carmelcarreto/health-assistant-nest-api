---
runme:
  id: 01HFF5NJ1VQ4YDEN6ERQWPZ1PG
  version: v2.0
---

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Run in development

1. Clone the repository
2. Execute

```sh {"id":"01HFF5NJ1VQ4YDEN6ERD7M8G3A"}
yarn install

```

3. You must have Nest CLI installed

```sh {"id":"01HFF5NJ1VQ4YDEN6ERG85P73B"}
npm i -g @nestjs/cli

```

4. Get up the database

```sh {"id":"01HFF5NJ1VQ4YDEN6ERHF43MKN"}
docker-compose up -d

```

## Used Stack

* MySQL
* Nest

## Running the app

```bash {"id":"01HFF5NJ1VQ4YDEN6ERJCJ7MJN"}
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod

```

## Test

```bash {"id":"01HFF5NJ1VQ4YDEN6ERP2AHJJX"}
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov

```

## Description of RESTfull API using Swagger

### Create endpoint documentation

```bash {"id":"01HFF5NJ1VQ4YDEN6ERPC4AC57"}
# Installation
$ npm install --save @nestjs/swagger

# open de main.ts file and initialize Swagger using the SwaggerModule class:
$ const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

# Now you can run the following command to start the HTTP server:
$ npm run start
```

#While the application is running, open your browser and navigate to http://localhost:3000/api. You should see the Swagger UI.

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://docs.nestjs.com/assets/swagger1.png" width="400" alt="" /></a>
</p>
# As you can see, the SwaggerModule automatically reflects all of your endpoints.
