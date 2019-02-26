# Example: Router

> **WARNING** Requires Node 7.4 or later – example uses `async` and `await`~!

This example shows how to attach a router to your Polkadot server.<br>
More specifically, [Trouter](https://github.com/lukeed/trouter) is used, which is the same router used for [Polka](https://github.com/lukeed/polka).

Here, we've created a RESTful resource that integrates with [`jsonplaceholder`](https://github.com/typicode/jsonplaceholder) API's `/posts` resource.<br>
Most requests are forwarded to the server via [`httpie`](https://github.com/lukeed/httpie), but we've also included a simple JSON body parser.

## Setup

```sh
$ npm install
$ npm start
```

## Usage

```sh
# List all Posts
$ curl http://localhost:3000
#=> (200) [{{"userId":1,"id":1,"title":"..."}, {"userId":1,"id":2,"title":"..."}, ...]

# Retrieve single Post (bad ID)
$ curl http://localhost:3000/foobar
#=> (400) Invalid "id" parameter

# Retrieve single Post
$ curl http://localhost:3000/1
#=> (200) {"userId":1,"id":1,"title":"sun...to"}

# Create a new Post
$ curl -X POST http://localhost:3000/1 -d '{"title":"foo","subtitle":"bar"}' -H 'content-type:application/json'
#=> (201) {"id":101,"title":"foo","subtitle":"bar"}

# Update a Post's titile
$ curl -X PUT http://localhost:3000/1 -d '{"title":"hello"}' -H 'content-type:application/json'
#=> (200) {"userId":1,"id":1,"title":"hello"}

# Delete a Post
$ curl -X DELETE http://localhost:3000/1
#=> (204) ""
```

## Deploy

> You may use [Up](https://up.docs.apex.sh/) or [Now](https://zeit.co/now) to deploy this example to the cloud seamlessly.

```sh
$ up
# or
$ now
```
