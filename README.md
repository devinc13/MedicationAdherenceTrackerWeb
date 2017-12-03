# MedicationAdherenceTrackerWeb
The Web App portion of the Medication Adherence Tracker

Skeleton code taken from the [Relay Starter Kit](https://github.com/relayjs/relay-starter-kit)

## Installation

```
npm install
```

Install postgres.

Create a user, a database, and create the `PGUSER`, `PGPASSWORD`, `PGHOST` and `PGDATABASE` environment variables for the username, password, host and database name. Create the `JWT_SECRET` environment variable to store the secret used for JSON web token authentication.

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

Manually updating adherence info: If the server is running, it will update adherence information on an hourly basis. If you happen to not have the server running, but want to update adherence information for a specific amount of time, run the following (replacing dates as desired): `node manuallyUpdateAdherence.js '2017-11-06 01:00:00' '2017-11-12 23:00:00'`.

Branch `heroku` has some small changes that allow for the app to run on Heroku. If making changes, use `git push heroku heroku:master` to push from the `heroku` branch to Heroku's `master` branch.

The heroku branch currently has the hourly task disabled, since the dyno will go to sleep after half an hour of inactivity, and miss runs of the task. This could be re-implemented as a heroku scheduler job, which will run it in one-off dynos.
