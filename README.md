
[![Build Status](https://travis-ci.org/madeofhuman/Maintenance-Tracker-App.svg?branch=staging-api-v1)](https://travis-ci.org/madeofhuman/Maintenance-Tracker-App)
[![Coverage Status](https://coveralls.io/repos/github/madeofhuman/Maintenance-Tracker-App/badge.svg?branch=staging-api-v1)](https://coveralls.io/github/madeofhuman/Maintenance-Tracker-App?branch=staging-api-v1)
[![Maintainability](https://api.codeclimate.com/v1/badges/b8c7389b9900a8f5df19/maintainability)](https://codeclimate.com/github/madeofhuman/Maintenance-Tracker-App/maintainability)

# Maintenance Tracker
Maintenance Tracker is an application that provides users with the ability to reach out to operations or repairs department regarding repair or maintenance requests and monitor the status of their request.

## Features
  1. Users can create an account and log in.
  2. The users can make maintenance or repair requests.
  3. An admin can approve or reject a request.
  4. The admin can mark request as resolved once it is done.
  5. The admin can  view all requests in the system.
  6. The admin can filter requests by type and user
  7. The user can view all his/her requests

## Installation
  1. Run the following commands in your terminal:
    ```
      git clone git@github.com:madeofhuman/Maintenance-Tracker-App.git
      cd Maintenance-Tracker-App
      npm install
    ```
  2. The application requires Postgres database, follow the instructions [here](https://www.postgresql.org/download/)
     to download and install it for your operating system.
  3. Add postgres to your PATH on [windows](https://bobbyong.com/blog/installing-postgresql-on-windoes/), [Linux](https://www.postgresql.org/docs/8.3/static/install-post.html), and [Mac](https://postgresapp.com/documentation/install.html)
  4. Run the following command to create the database tables
    ```
      psql -U [postgres username] -d [postgres dataBase (default is _postgres_)] -f seed.sql
    ```
  5. Start the local server by running
    ```
      npm run start:dev
    ```