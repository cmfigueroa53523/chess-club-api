# chess-club-api

This is an API for managing my chess club.

# Getting started

## Clone this repository

```
git clone git@github.com:knaiskes/chess-club-api.git
```

## Install dependencies

```
cd chess-club-api/
npm install
```

## Set your environment variables

```
cp .env-example .env
```

Modify any of the environment variables in the .env accordingly

## Start the project

``` bash
chmod +x infra_up.sh
./infra_up.sh
```

## Stop the project

``` bash
chmod +x infra_down.sh
./infra_down.sh
```

## Get a token testing token

```
curl -X POST url:3000/get-token -H "Content-Type: application/json" -d '{"username": "user", "password": "password"}'
```


## Default admin credentials

- Username: admin
- Password: admin

It is possible to change the default credentials before starting the project by editing the ./postgres/init.sql file.

# Frontend

A separate project has been developed as the frontend for this API. It is available at: [https://github.com/knaiskes/chess-club-frontend](https://github.com/knaiskes/chess-club-frontend)

# Demo

[![Chess Club Demo](https://img.youtube.com/vi/XU6Epy_bRjw/0.jpg)](https://www.youtube.com/watch?v=XU6Epy_bRjw)

