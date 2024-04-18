# Northcoders News API

## Summary

This project is designed to mimic a the backend of a service like Reddit, which can send information to a front end architecture by interacting with a PSQL database.

## Usage

There is a hosted version of this project [here](https://northcoders-news-api-zzkn.onrender.com/).

For a list of all available endpoints and details on their usage, make a GET request at the **/api** endpoint.

## Local setup

Clone [this](https://github.com/G-eebs/northcoders-news-api) GitHub repository with `git clone https://github.com/G-eebs/northcoders-news-api.git`.

The minimum versions of **Node.js** and **node-postgres** required for this project are:
- **Node.js:** 21.6.2
- **node-postgres:** 8.7.3

Run `npm i` to install all dependencies including dev dependencies.

There are two databases in this project, one with dev data and one with test data. In order to connect to these databases locally you will need to create two .env files:

- **.env.test** containing: `PGDATABASE=nc_news_test`

- **.env.development** containing: `PGDATABASE=nc_news`

There are various scripts in **package.json**:
- `npm run setup-dbs` will create the test and development databases
- `npm run seed` will seed the development database
- `npm test` will run all tests in the **\_\_tests\_\_** folder. The test database is seeded when tests are run.
