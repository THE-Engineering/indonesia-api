# Indonesia API

## CSV

The default directory for CSV files is `.source`

This is configurable with the environment variable `SOURCE_DIRECTORY`

```dotenv
SOURCE_DIRECTORY=<DIRECTORY PATH>
```

Or with the command line argument `--SOURCE_DIRECTORY`

```bash
npm start -- --SOURCE_DIRECTORY '<DIRECTORY PATH>'
```

Note, in this project _command line arguments_ take precedence over _environment variables_

The default directory `.source` is excluded from Git

## JSON

The default directory for JSON files is `.target`

This is configurable with the environment variable `TARGET_DIRECTORY`

```dotenv
TARGET_DIRECTORY=<DIRECTORY PATH>
```

Or with the command line argument `--TARGET_DIRECTORY`

```bash
npm start -- --TARGET_DIRECTORY '<DIRECTORY PATH>'
```

Again, note in this project _command line arguments_ take precedence over _environment variables_

And the default directory `.target` is excluded from Git

## Environment variables

While `.env` files are excluded from Git there is a `.env.default` file in the project root containing the current default values from which you can create a `.env` for your development environment

## Basic Auth

This project implements Basic Auth with credentials supplied to it in JSON format either as an environment variable or from the command line

```dotenv
BASIC_AUTH_USERS={"<USERNAME>":"<PASSWORD>"}
```

Or

```bash
npm start -- --BASIC_AUTH_USERS '{"<USERNAME>":"<PASSWORD>"}'
```

## Serving the JSON

Start the server in a terminal

```bash
npm start
```

You can request data from any of three routes

- `/wurportal`
- `/wurcitations`
- `/wurmetrics`

And each route accepts three query parameters in any combination

- `institution_id`
- `year`
- `subject_id`

An `institution_id` is a string of the form `i-00000000` (where each `0` is an integer between `0` and `9` inclusive)

A `year` is a year (between 2001 and the current year inclusive)

A `subject_id` is a string

Response data is filtered based on the request query parameter values

### `curl`

Use `curl` in another terminal to request data

Assuming the server is running on port `80` with Basic Auth credentials `{"username":"password"}`

```bash
curl http://localhost/wurportal \
  -u username:password
```

```bash
curl http://localhost/wurcitations \
  -u username:password
```

```bash
curl http://localhost/wurmetrics \
  -u username:password
```

And using the route `/wurportal` with query parameters

```bash
curl http://localhost/wurportal?institution_id=i-33670869 \
  -u username:password
```

```bash
curl http://localhost/wurportal?year=2020 \
  -u username:password
```

```bash
curl http://localhost/wurportal?subject_id=law \
  -u username:password
```

Or, combined

```bash
curl http://localhost/wurportal?institution_id=i-33670869&year=2020&subject_id=law \
  -u username:password
```

## Docker

### Building the Docker image

```bash
docker build -t indonesia-api .
```

### Starting the Docker container

```bash
docker compose up -d
```

The container exposes the application on port `3001` of the host environment

Assuming Basic Auth credentials `{"username":"password"}`

```bash
curl http://localhost:3001/wurportal \
  -u username:password
```
