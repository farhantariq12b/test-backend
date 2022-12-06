# This is the details to set the environment and run the project

## Environment Setup

Steps:

1. copy ``.env.example`` to ``.env`` using this command `cp .env.example .env`
2. Install [Postgres](https://www.postgresql.org/download/macosx/). If not installed
4. Change the following env variables value with your database credentials:

    PG_DB_NAME='database_name'

    PG_USER='database_user'

    PG_PASSWORD='database_password'

## Project commands

1. Run `yarn`
2. Run `yarn migration`
3. Run `yarn seed`

## To run the project

1. Run `yarn dev`
2. Project is ready to be served on your desired ``port`` (Default: ``3333``)
3. you can visit the project from `http://localhost:3333`
