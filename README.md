<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Ejecutar en desarrollo

1. Clonar el repositorio

2. Ejecutar

```sh
yarn install

```

3. Tener Nest CLI instalado

```sh
npm i -g @nestjs/cli

```

4. Levantar la base de datos

```sh
docker-compose up -d

```

## Stack usado

* MySQL
* Nest

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod

```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov

```

## Descripcion de la API RESTful uso de Swagger

## Crear documentacion de los endpoints

```bash
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
