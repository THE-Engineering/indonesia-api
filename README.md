# Indonesia API

## AWS

There are two paths to setting up the infra required; use the terraform script in `infra` or use the below guide to do it by hand.

```
cd infra/
aws-vault exec <ENVIROMENT_USER_NAME> -- terraform init
aws-vault exec <ENVIROMENT_USER_NAME> -- terraform apply
```

Alternatively, by hand:

- Step 1 - [Create an Access Key](docs/create-an-access-key.md)
- Step 2 - [Decide your Region](docs/decide-your-region.md)
- Step 3 - [Create a queue with Amazon SQS (Simple Queue Service)](docs/create-a-queue.md)
- Step 4 - [Create a bucket with Amazon S3](docs/create-a-bucket.md)
- Step 5 - [Edit the queue to assign an Access Policy](docs/edit-the-queue.md)
- Step 6 - [Edit the bucket to send events to the queue](docs/edit-the-bucket.md)
- Step 7 - [Review your `.env` file](docs/review-your-env.md)

When these steps have been completed and while this application is running it will listen for messages from AWS with Amazon SQS

Those messages are to notify this application of changes in Amazon S3

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

You can request data from any of six routes

- `/impact-overall`
- `/wur-portal`
- `/wur-citations`
- `/wur-metrics`
- `/wur-id-mapping`
- `/wur-ref-data`

And each route accepts up to three query parameters (which may be combined)

- `institution_id`
- `year`
- `subject_id`

An `institution_id` is a string of the form `i-00000000` (where each `0` is an integer between `0` and `9` inclusive)

A `year` is a year (between 2001 and the current year inclusive)

A `subject_id` is a string

Response data is filtered based on the request query parameter values

#### `/impact-overall`

Accepts

- `institution_id`
- `year`

#### `/wur-portal`

Accepts

- `institution_id`
- `year`
- `subject_id`

#### `/wur-citations`

Accepts

- `institution_id`
- `year`
- `subject_id`

#### `/wur-metrics`

Accepts

- `institution_id`
- `year`
- `subject_id`

#### `/wur-id-mapping`

Accepts

- `institution_id`

#### `/wur-ref-data`

Accepts

- `institution_id`

### `curl`

Use `curl` in another terminal to request data

Assuming the server is running on port `80` with Basic Auth credentials `{"username":"password"}`

```bash
curl http://localhost/wur-portal \
  -u username:password
```

```bash
curl http://localhost/wur-citations \
  -u username:password
```

```bash
curl http://localhost/wur-metrics \
  -u username:password
```

And using the route `/wur-portal` with query parameters

```bash
curl http://localhost/wur-portal?institution_id=i-33670869 \
  -u username:password
```

```bash
curl http://localhost/wur-portal?year=2020 \
  -u username:password
```

```bash
curl http://localhost/wur-portal?subject_id=law \
  -u username:password
```

Or, combined

```bash
curl http://localhost/wur-portal?institution_id=i-33670869&year=2020&subject_id=law \
  -u username:password
```

## Swagger

Assuming the server is running on port `80` with Basic Auth credentials `{"username":"password"}` Swagger JSON is available at the location

```
http://localhost/api-docs/swagger.json
```

Swagger UI is available at the location

```
http://localhost/api-docs
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
curl http://localhost:3001/wur-portal \
  -u username:password
```
