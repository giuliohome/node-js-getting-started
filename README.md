# Angular tour of heroes served from node-js-getting-started

This is my implementation of Angular CRUD rest api in Node.js with Heroku Postgres provisioning.

You can find the implementation for SQLite and Oracle 19c in my other [Node.js Express repository](https://github.com/giuliohome/ngExpressAngular2Oracle).

A barebones Node.js app using [Express 4](http://expressjs.com/).

This application supports the [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs) article - check it out.

# Install and build Angular app
- Download `toh-pt6.zip` from https://angular.io/tutorial
- Delete `angular-in-memory-web-api` from `package.json` dependencies, delete file `in-memory-data.service.ts` and its import from `app.module.ts`
- `ng build --base-href "/toh/" --prod`
- deploy the `dist` folder renamed as `toh` under the public folder of this node.js app root (notice that the `index.js` is modified ad hoc to serve Angular)
- all the above is already done and included in this repo (see the toh folder)
- [provision a postgres database](https://devcenter.heroku.com/articles/getting-started-with-nodejs#provision-a-database)
- create and initialize the `heroes` table (see more below)

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

You also need to have [Postgres installed locally](https://devcenter.heroku.com/articles/heroku-postgresql#local-setup).

```sh
$ git clone https://github.com/heroku/node-js-getting-started.git # or clone your own fork
$ cd node-js-getting-started
$ npm install
$ npm start
$ psql -d myapp -U  data_owner
myapp=> create table heroes (id serial primary key, name text);
myapp=> insert into heroes(name) values ('Dr Nice'),('Narco'), ('Bombasto'),('Celeritas'),('Magneta'),('RubberMan');
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku and go to Angular demo

```
$ heroku create
$ git push heroku main
$ heroku psql
myapp::DATABASE=> create table heroes (id serial primary key, name text);
myapp::DATABASE=> insert into heroes(name) values ('Dr Nice'),('Narco'), ('Bombasto'),('Celeritas'),('Magneta'),('RubberMan');
$ heroku open toh

```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)
