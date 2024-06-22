# chess-club-api

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

## Start the API

```
npm run start
```

### Start the API for development

```
npm run dev
```

## Get a token

```
curl -X POST url:3000/get-token -H "Content-Type: application/json" -d '{"username": "user", "password": "password"}'
```
