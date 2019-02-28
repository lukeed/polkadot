<div align="center">
  <img src="logo.png" alt="polkadot" height="260" />
</div>

<h1 align="center">Polkadot</h1>

<div align="center">
  <a href="https://npmjs.org/package/polkadot">
    <img src="https://badgen.now.sh/npm/v/polkadot" alt="version" />
  </a>
  <a href="https://travis-ci.org/lukeed/polkadot">
    <img src="https://badgen.now.sh/travis/lukeed/polkadot" alt="travis" />
  </a>
  <a href="https://codecov.io/gh/lukeed/polkadot">
    <img src="https://badgen.now.sh/codecov/c/github/lukeed/polkadot" alt="codecov" />
  </a>
  <a href="https://npmjs.org/package/polkadot">
    <img src="https://badgen.now.sh/npm/dm/polkadot" alt="downloads" />
  </a>
  <a href="https://packagephobia.now.sh/result?p=polkadot">
    <img src="https://badgen.net/packagephobia/install/polkadot" alt="install size" />
  </a>
</div>

<div align="center">The tiny HTTP server that gets out of your way~!</div>

## Features

* **Intentionally Minimal**<br>
    _Build your own stack! Polkadot doesn't even include a router._<br>
    _Polkadot can accommodate any & all of your perferences. This is **your** app._

* **Extremely Lightweight**<br>
    _Even with all dependencies, Polkadot weighs less than 15kB!_<br>
    _It's the perfect candidate for serverless environments._

* **Simple yet Flexible**<br>
    _You can learn the "framework" during lunch and deploy before the day's end._<br>
    _There's no limit to what you can do – [nor how you can do it](#handlers)._

* **Highly Performant**<br>
    _Because Polkadot does so little, it's as ["blazing fast"](/bench) as they come._

* **Async Support**<br>
    _It's 2019 – time to `await` all the things~!_



## Install

```
$ npm install --save polkadot
```


## Usage: CLI

Just specify an entry file – that's it! :tada:<br>
If you do not provide one, then `index.js` is assumed.

Customize the port by setting the `PORT` environment variable.<br>
The `PORT` will default to `3000` if left undeclared.

> **Important:** An error will be thrown if the `PORT` is in use.

```sh
# Examples:

$ polkadot
$ polkadot app.js
$ PORT=8080 polkadot app.js
```

```js
// index.js
const { get } = require('httpie');

module.exports = async (req, res) => {
  let uri = `https://jsonplaceholder.typicode.com/posts`;
  if (req.query.id) {
    uri += `/${req.query.id}`;
  }
  let res = await get(uri);
  return res.data;
}
```


## Usage: Programmatic

For those who need to control the lifecycle and/or lifespan of their server(s), a [programmatic API](#api) is available.<br>
Similarly, this is the only way to customize the underlying `server` itself (see the [`with-https`](https://github.com/lukeed/polkadot/tree/master/examples/with-https) example).

```js
const { get } = require('httpie');
const polkadot = require('polkadot');

const app = polkadot(async (req, res) => {
  let uri = `https://jsonplaceholder.typicode.com/posts`;
  if (req.query.id) {
    uri += `/${req.query.id}`;
  }
  let res = await get(uri);
  return res.data;
});

app.listen(3000, err => {
  if (err) throw err;
  console.log('> Running on localhost:3000');
});
```

## API

> **Note:** The following pertains to [Programmatic Usage](#usage-programmatic) only

### polkadot.handler(req, res)
Returns: `Function`

The main `polkadot` handler.

It parses the `req` (see [`IncomingMessage`](https://nodejs.org/api/http.html#http_class_http_incomingmessage)) and assigns value to the `path`, `query`, and `search` keys<sup>1</sup>.<br>
It also waits until the `res` (see [`ServerResponse`](https://nodejs.org/api/http.html#http_class_http_serverresponse)) has been terminated or until data is returned.<sup>2</sup>

> _<sup>1</sup> See [`@polka/url`](https://github.com/lukeed/polka/tree/master/packages/url) for further details._<br>
> _<sup>2</sup> See [Handlers](#handlers) for varying return types._

### polkadot.listen()
Returns: `http.Server`

Boots (or creates) the underlying [`http.Server`](https://nodejs.org/api/http.html#http_class_http_server) for the first time.<br>
All arguments are passed directly to [`server.listen`](https://nodejs.org/api/net.html#net_server_listen) with no changes.


## Handlers

Every handler receives a `req` ([`IncomingMessage`](https://nodejs.org/api/http.html#http_class_http_incomingmessage)) and a `res` ([`ServerResponse`](https://nodejs.org/api/http.html#http_class_http_serverresponse)) pair of arguments.<br>
These are the true, mostly unfettered<sup>1</sup> instances that the `http.Server` created, so you have full access to all native APIs.

> _<sup>1</sup> Before calling your handler(s), [`@polka/url`](https://github.com/lukeed/polka/tree/master/packages/url) assigns value to `req.path`, `req.query`, and `req.search` keys._

There are multiple ways to format or return the server response. You may mix and match them, as you are not restricted to a particular format in your application(s).

### 1. Use Native APIs

Because you have direct access to `res` (see [`ServerResponse`](https://nodejs.org/api/http.html#http_class_http_serverresponse)), you can set headers, the statusCode, and/or write response data with the core Node.js methods:

```js
module.exports = function (req, res) {
  res.statusCode = 400;
  res.setHeader('Content-Type', 'application/json');
  res.end('{"error":"Bad Request"}');
}
```

### 2. The `@polka/send-type` library

The [`@polka/send-type`](https://github.com/lukeed/polka/tree/master/packages/send-type) library is a utility function that composes your response through a simple API. It also inspects your response data and will auto-set its `Content-Type` (if unspecified) and `Content-Length` headers for you. Additionally, it will stringify Objects into JSON on your behalf!

> **Note:** Check out its [Data Detections](https://github.com/lukeed/polka/tree/master/packages/send-type#data-detections) documentation.

Because the [`@polka/send-type`](https://github.com/lukeed/polka/tree/master/packages/send-type) library is already a dependency of `polkadot`, using it comes at _no extra cost_!

```js
const send = require('@polka/send-type');

module.exports = function (req, res) {
  send(res, 400, {
    error: 'Bad Request'
  });
}
```

### 3. Return data

Polka uses the [`@polka/send-type`](https://github.com/lukeed/polka/tree/master/packages/send-type) library internally, which allows you to `return` data directly from your function handler instead of using the native APIs to format the response manually.

Because of this, `@polka/send-type` can inspect your outgoing data and determine its `Content-Type` (if unspecified) and `Content-Length` response headers on your behalf. Similarly, it will automatically convert Objects into JSON strings.

> **Note:** Check out its [Data Detections](https://github.com/lukeed/polka/tree/master/packages/send-type#data-detections) documentation.

```js
module.exports = function (req, res) {
  res.statusCode = 400;
  return {
    error: 'Bad Request'
  };
};
```

### 4. Async Returns

Polkadot works great with asynchronous functions!<br>
You can certainly fetch data from external APIs, interact with databases, ...etc without any problems.

Of course, your asynchronous chain(s) may also use native `res` APIs, the `@polka/send-type` helper, or may return data directly. All options are always available!

The **only** rule is that if your handler _ends_ in a `Promise` or `AsyncFunction`, that function **must be returned** so that Polkadot can resolve it on your behalf.

> **Important:** The use of `AsyncFunction` is only supported in Node versions `7.4` and above.

```js
// For demo, not required
const send = require('@polka/send-type');

// Using Promises
module.exports = function (req, res) {
  // must `return` the Promise
  return isUser(req).then(user => {
    if (user) {
      send(res, 200, { user });
    } else {
      send(res, 401, 'You must be logged in');
    }
  });
};

// Using AsyncFunctions
module.exports = async function (req, res) {
  const user = await isUser(req);
  if (user) {
    send(res, 200, { user });
  } else {
    send(res, 401, 'You must be logged in');
  }
}
```

## Routing

Before your handler is called, Polkadot will parse the request to provide you with some core information.<br>
It will use [`@polka/url`](https://github.com/lukeed/polka/tree/master/packages/url) to make `req.path`, `req.search`, and `req.query` available.

While polkadot _does not_ include a router, you can create your own or import **any** router of your choosing!<br>
Please check out the [`with-router`](https://github.com/lukeed/polkadot/tree/master/examples/with-router) example that uses [Trouter](https://github.com/lukeed/trouter) to build a full JSON resource.

Below is a simple example that serves images & video files based on the incoming path:

```js
const fs = require('fs');
const { join } = require('path');
const mime = require('mime/lite');

const assets = join(__dirname, 'assets');

function sendfile(res, dir, filename) {
  const file = join(assets, dir, filename);
  if (fs.existsSync(file)) {
    res.setHeader('Content-Type', mime.getType(file));
    fs.createReadStream(file).pipe(res);
  } else {
    res.statusCode = 404;
    res.end('File not found');
  }
}

// Supports: /images?filename=foobar.jpg
// Supports: /videos?filename=foobar.mp4
module.exports = function (req, res) {
  const { filename } = req.query;
  if (req.path === '/images') {
    sendfile(res, 'images', filename);
  } else if (req.path === '/videos') {
    sendfile(res, 'videos', filename);
  } else {
    res.statusCode = 404;
    res.end('Unknown filetype');
  }
}
```


## Error Handling

You must handle your own errors. This is because Polkadot will not dictate your application design nor its behavior – and _how_ an application responds to and handles errors is a large, important part of its design!

> Please visit the [`with-middleware`](https://github.com/lukeed/polkadot/tree/master/examples/with-middleware) or the [`with-router`](https://github.com/lukeed/polkadot/tree/master/examples/with-router) examples.<br> They are both more complex demonstrations that handle errors while chaining or composing functions together.

For simple endpoints, it's very straightforward (as it should be):

```js
// Send 404 if unknown path
module.exports = function (req, res) {
  if (req.path !== '/') {
    res.statusCode = 404;
    return 'Page not found';
  }
  return 'OK';
}

// ---

const { get } = require('httpie');

// Send 404 if ID unknown to external API
module.exports = async function (req, res) {
  try {
    const ID = req.query.id;
    let { data } = await get(`https://example.com/users/${ID}`);
    send(res, 200, { user:data });
  } catch (err) {
    const code = err.statusCode || 404;
    const message = err.data || 'User not found';
    console.error('Error: ', req.query.id, code, message);
    send(res, code, message);
  }
}
```


## Benchmarks

For performance results and comparisons, please check out the [`bench`](/bench) directory.


## Prior Art

Polkadot is the "little sibling" to [Polka](https://github.com/lukeed/polka). It's effectively the core of Polka, stripped of all routing, middleware sequencing, and Express compatibility layers. While Polka is already leaner than most everything else, there was an opportunity to further satisfy the minimalists and make a microscopic version of Polka – hence, polka•_dot_.

Additionally, Polkadot follows in the footsteps of [`micro`](https://github.com/zeit/micro), which was the first HTTP framework of our kind (to my knowledge).


## License

MIT © [Luke Edwards](https://lukeed.com)
