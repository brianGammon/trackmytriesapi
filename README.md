# TrackMyTries API

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)


RESTful API for the TrackMyTries application. Track your fitness progress by recording every "Try" of one of the PRT exercises (Sit ups, Push up, Pull ups, or 1.5 mile run). Later version will allow users to create their own categories of Tries.

https://trackmytries-dev.herokuapp.com

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisities

Make sure your system has the following foundational software installed:

* NodeJS
* MongoDB, or a Mongolab instance

Next, globally install gulp:
```
npm install -g gulp
```

### Installing

Clone the repo into your projects directory:

```
git clone https://github.com/brianGammon/trackmytriesapi.git
cd trackmytriesapi


```

Next, install the dependencies and launch the server:

```
npm install
gulp
```

The default ```gulp``` task will build, lint, run all unit tests, and start the server using nodemon.

Verify the API is up by browsing to: http://localhost:3000/

## Running the tests

### Unit tests
Unit tests are automatically run when ```gulp``` is used to start up the development environment. Use can also run the unit tests manually by running:
```
gulp test
```

### Coverage report
To run all unit tests and generate a coverage report run:
```
gulp coverage
```

### End to end tests

TBD

## Migrations
Run the migrations to seed your MongoDB instance with sample data
```
node ./node_modules/mongodb-migrate -runmm -dbc '{ "host": "localhost", "db": "trackmytries-dev" }' up
```

## Authors

* **Brian Gammon** - *Initial work* - [GitHub](https://github.com/brianGammon)

## License

This project is licensed under the MIT License

## Acknowledgments

* Inspired by a desire to learn NodeJS, and gain experience in JavaScript
