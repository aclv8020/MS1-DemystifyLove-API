# Hello SQLite (blank)

This project includes a [Node.js](https://nodejs.org/en/about/) server script that uses a persistent [SQLite](https://www.sqlite.org) database.

The database stores chat messages, each one with an ID and string of message text. The endpoints allow the client to retrieve, add, update, and delete messages, using an admin key you can set in the `.env`.

_The home route `/` lists the endpoints in the API. With the Glitch editor open showing the preview on the right, click __Change URL__ and add `messages` to the end to see the first `GET` request._

_Last updated: 14 August 2023_

## What's in this project?

← `README.md`: That’s this file, where you can tell people what your cool website does and how you built it.

← `server.js`: The Node.js server defines the endpoints in the site API, processing requests, connecting to the database using the `sqlite.js` script, and sending info back to the client.

← `sqlite.js`: The database script handles setting up and connecting to the SQLite database. The `server.js` API endpoints call the functions in the database script to manage the data.

When the app runs, the scripts build the database:

← `.data/chat.db`: Your database is created and placed in the `.data` folder, a hidden directory whose contents aren’t copied when a project is remixed. You can see the data in the Glitch Log when the scripts first execute.

← `package.json`: The NPM packages for your project's dependencies.

← `.env`: The environment is cleared when you initially remix the project, but you can add and edit.

## Setting up your admin key

The API allows the client to update data if a valid key is provided. This is a simplified example of auth that checks if the submitted key matches the one in the `.env`.

To set your app up to support auth:

* In your `.env` file, find the variable named `ADMIN_KEY` and give it a text string as a value.
* Pass the value with requests in an `admin_key` header.

## Making requests

You can make requests to the API using curl on the command line or from any API client. Grab your API base URL when you remix the project–you can get it by clicking __Show__.

The following outline indicates requirements for each endpoint:

* `GET /messages`
* `POST /message` 🔒
  * Include a request __Body__ with a property named `message`
* `PUT /message` 🔒
  * Include a request __Body__ with properties `id` and `message`
* `DELETE /message` 🔒
  * Include a query parameter named `id`

🔒 For endpoints requiring auth:
* Include your admin key value from the `.env` in a request header named `admin_key`.

![Glitch](https://cdn.glitch.com/a9975ea6-8949-4bab-addb-8a95021dc2da%2FLogo_Color.svg?v=1602781328576)

## You built this with Glitch!

[Glitch](https://glitch.com) is a friendly community where millions of people come together to build web apps and websites.

- Need more help? [Check out our Help Center](https://help.glitch.com/) for answers to any common questions.
- Ready to make it official? [Become a paid Glitch member](https://glitch.com/pricing) to boost your app with private sharing, more storage and memory, domains and more.
