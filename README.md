
[![Build Status](https://travis-ci.org/madeofhuman/Maintenance-Tracker-App.svg?branch=staging-api-v1)](https://travis-ci.org/madeofhuman/Maintenance-Tracker-App)
[![Coverage Status](https://coveralls.io/repos/github/madeofhuman/Maintenance-Tracker-App/badge.svg?branch=staging-api-v1)](https://coveralls.io/github/madeofhuman/Maintenance-Tracker-App?branch=staging-api-v1)
[![Maintainability](https://api.codeclimate.com/v1/badges/b8c7389b9900a8f5df19/maintainability)](https://codeclimate.com/github/madeofhuman/Maintenance-Tracker-App/maintainability)

# Maintenance Tracker
Maintenance Tracker is an application that provides users with the ability to reach out to operations or repairs department regarding repair or maintenance requests and monitor the status of their request.

## App features
  1. A user can create an account and log in.
  2. A user can make maintenance or repair requests.
  3. An admin can approve or reject a request.
  4. An admin can mark request as resolved once it is done.
  5. An admin can  view all requests in the system.
  6. An admin can filter requests by type and user
  7. A user can view all their requests
  8. A user can delete their request
  9. A user can modify their request

# Getting Started
Follow the instructions below to get a copy of the project running on your local machine for development and testing purposes.

## 1. Technology used
  1. NodeJS
  2. Express
  3. PostgreSQL

## 2. Coding style
  Airbnb style

## 3. How to install
  1. [Install NodeJS])(https://nodejs.org/en/download/)
  2. Run the following commands in your terminal to clone the application and install its dependencies:
  ```
  git clone git@github.com:madeofhuman/Maintenance-Tracker-App.git
  cd Maintenance-Tracker-App
  npm install
  ```
  3. The application requires Postgres database, follow the instructions [here](https://www.postgresql.org/download/)
     to download and install it for your operating system.
    3.1. Add postgres to your PATH on [Windows](https://bobbyong.com/blog/installing-postgresql-on-windoes/), [Linux](https://www.postgresql.org/docs/8.3/static/install-post.html), and [Mac](https://postgresapp.com/documentation/install.html)
  5. In the root directory of the application, run the following command to create the database tables
  ```
  psql -U [postgres username] -d [postgres dataBase (default is 'postgres')] -f seed.sql
  ```
  6. Start the local server by running
  ```
  npm run start:dev
  ``` 

## 4. Working Endpoints
  | Endpoint | Functionality | Note |
|----------------------------------------|-----------------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| POST /auth/signup | Register a user |  |
| POST /auth/login | Login a user |  |
| GET /users/requests | Fetch all the requests of a<br> logged-in user |  |
| GET  /users/requests/:requestId | Fetch a request that belongs to<br>a logged in user |  |
| POST /users/requests | Create a request |  |
| PUT  /users/requests/:requestId | Modify a request | Only possible when the admin<br>has approved the request |
| DELETE /users/requests/:requestId | Deletes a request |  |
| GET  /requests/ | Fetch all the requests | Only available to admin users |
| PUT  /requests/:requestId/approve | Approve a request | Only available to admin users.<br> When this endpoint is called,<br>the status of the request should be pending. |
| PUT  /requests/:requestId/disapprove | Disapprove a request | Only available to admin users.<br> When this endpoint is called,<br>the status of the request should be disapproved. |
| PUT  /requests/:requestId/resolve | Resolve a request | Only available to admin users.<br> When this endpoint is called,<br>the status of the request should be resolved. |

## 5. Testing
  The app includes some automated tests that test for certain functionalities. The test suite can be run by running the following command in your terminal:
  ```
  npm test
  ```

# Author
  - Chukwuka Odina

# License
ISC

# App Links
  [Pivotal Tracker Board](https://www.pivotaltracker.com/projects/2170415)
  
  [Github Pages](https://madeofhuman.github.io/Maintenance-Tracker-App/)
  
  [Hosted App](https://maintain-r.herokuapp.com/)
