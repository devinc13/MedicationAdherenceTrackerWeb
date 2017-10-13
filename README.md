# MedicationAdherenceTrackerWeb
The Web App portion of the Medication Adherence Tracker

Skeleton code taken from the [Relay Starter Kit](https://github.com/relayjs/relay-starter-kit)

## Installation

```
npm install
```

Install postgres.

Create a user, and create the `PG_USERNAME` and `PG_PASSWORD` environment variables that match.

Create a database called medicationTracker.

Run migrations by typing `db-migrate up`.

## Running

Start a local server:

```
npm start
```

## Developing

Any changes you make to files in the `js/` directory will cause the server to
automatically rebuild the app and refresh your browser.

If at any time you make changes to `data/schema.js`, stop the server,
regenerate `data/schema.json`, and restart the server:

```
npm run update-schema
npm start
```

To create a db migration run `db-migrate create migrationname` to create a blank migration called migrationname.

Write you migration using [do-migrate SQP API](https://db-migrate.readthedocs.io/en/latest/API/SQL/).

Run `db-migrate up` to run the migration.
