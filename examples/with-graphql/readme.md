# Example: GraphQL Request

> **WARNING** Requires Node 7.4 or later – example uses `async` and `await`~!

This example shows how to get and forward data from a GraphQL API request.<br>
Specifically, it will forward infomation from the [GraphQL Pokemon Demo](https://github.com/lucasbento/graphql-pokemon), utilizing [`httpie`](https://github.com/lukeed/httpie) for the server-side request.

## Setup

```sh
$ npm install
$ npm start
```

## Usage

```sh
# Default: Pikachu
$ curl http://localhost:3000
#=> (200) {"number":"025", "name":"Pikachu", "attacks":{"special":[...]}}

# Specify a pokemon
$ curl http://localhost:3000?name=Squirtle
#=> (200) {"number":"007","name":"Squirtle", "attacks":{"special":[...]}}
```

## Deploy

> You may use [Up](https://up.docs.apex.sh/) or [Now](https://zeit.co/now) to deploy this example to the cloud seamlessly.

```sh
$ up
# or
$ now
```
