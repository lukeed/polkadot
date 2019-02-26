# Example: Middleware

> **WARNING** Requires Node 7.4 or later – example uses `async` and `await`~!

This example shows how to attach and compose middleware to your core handler.

## Setup

```sh
$ npm install
$ npm start
```

## Usage

```sh
$ curl http://localhost:3000
#=> (400) Invalid "id" parameter

# Specify an ID value
$ curl http://localhost:3000?id=1
#=> (200) {"userId":1, "id":1, "title":"sunt...it", "body":"quia...ecto"}
```
