# Example: Fetch JSON from API

> **WARNING** Requires Node 7.4 or later – example uses `async` and `await`~!

This example shows how to get and forward data from a third-party JSON API.<br>
Specifically, it will forward the latest items from HNPWA's JSON API, utilizing [`httpie`](https://github.com/lukeed/httpie) for the server-side request.

## Setup

```sh
$ npm install
$ npm start
```

## Usage

```sh
$ curl http://localhost:3000
#=> (200) [{"id":19012872,"title":"3D cartoon..."}, ...]
```

## Deploy

> You may use [Up](https://up.docs.apex.sh/) or [Now](https://zeit.co/now) to deploy this example to the cloud seamlessly.

```sh
$ up
# or
$ now
```

