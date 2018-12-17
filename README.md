# cypress-node-api
A simple node API to run cypress on Windows.
Linux version to come.

### To install:

```npm install```

### To run:

```node app.js```

### Endpoints:

* / - shows current test run status
* /run - runs tests
* /results - shows results of last test run add ?v=true for verbose output.
* /report - Shows the latest test report courtesy of mocha-awesome: https://github.com/adamgruber/mochawesome

### Cypress

Firing a http get request to run will run all tests in the cypress integration folder.
To add your own test set visit the \cypress\integration folder.
If you are unfamiliar with Cyress please check it out at cypress.io.

todo: querystring to specify test category.
