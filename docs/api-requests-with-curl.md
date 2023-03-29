# Indonesia API

## API requests with `curl`

### API

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
