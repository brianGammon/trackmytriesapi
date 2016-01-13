# TrackMyTries API

RESTful API for the TrackMyTries application. Track your fitness progress by recording every "Try" of one of the PRT exercises (Sit ups, Push up, Pull ups, or 1.5 mile run). Later version will allow users to create their own categories of Tries.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisities

Make sure your system has the following foundational software installed:

* NodeJS
* MongoDB, or a Mongolab instance

Next, globally install bower and gulp:
```
npm install -g gulp
```

### Installing

Clone the repo into your projects directory:

```
git clone https://brianGammon@bitbucket.org/brianGammon/prttrackerapi.git
cd prttrackerapi


```

Next, install the dependencies and launch:

```
npm install
gulp
```

The default ```gulp``` task will build, lint, run all unit tests.

Verify the API is up by browsing to:
```curl http://localhost:3000/```

## Running the tests

### Unit tests
Unit tests are automatically run when ```gulp``` is used to start up the development environment.


### End to end tests

TBD

## Post install

### Migrations
Run the migrations to seed your MongoDB instance with sample data

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

* **Brian Gammon** - *Initial work* - [Bitbucket](https://bitbucket.org/brianGammon)

## License

This project is licensed under the MIT License

## Acknowledgments

* Inspired by a desire to learn NodeJS
