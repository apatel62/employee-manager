# Employee Manager

![license-badge](https://img.shields.io/badge/MIT_License-01a6ff)

## Table of Contents
- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [How to Contribute](#how-to-contribute)
- [Tests](#tests)
- [License](#license)
- [Questions](#questions)

## Description

A command-line application built from scratch that manages a company's database using Node.js, Inquirer, and PostgreSQL. When running the application, the user will be presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, update an employee role, and exit. Each action will have a corresponding SQL query that will be execueted with the exception of exit that ends the program.

## Installation

Node.js is required to run this code. Node.js can be installed by visting [Node.js](https://nodejs.org/en).

## Usage

This project was used to get a better understanding on how to code in SQL and integrating it with node.   

## How to Contribute

Please contact me before contributing to this project. My contact info is located in the Questions section.

## Tests

In your git bash where this repo is located, run npm install which runs the package.json file to install the inquirer, pg, and dotenv modules. Create a new file and name it ".env" which will store your database credentials. Inside this file you will have the following code.

```
DB_CONNECTION = your default database
DB_RUN = employee_db
DB_USER= your Postgres SQL username
DB_PASSWORD= your Postgres SQL password
```

Then run node index.js which will run the employee manager code.

The following video walkthroughs how to use the code: [walkthrough](https://drive.google.com/file/d/1HuYZTlJf6E2D2-eL1ahtmP-TKbyqVAnm/view?usp=sharing).

## License

This project is covered under the MIT license.

---

## Questions

GitHub username: [apatel62](https://github.com/apatel62) <br>
