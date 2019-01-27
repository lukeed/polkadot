# Example: HTTPS

This example shows how to start `polkadot` with a HTTPS server.

## Setup

```sh
# Import or Generate SSL keys
$ openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ssl/foobar.key -out ssl/foobar.crt

# Install & start
$ npm install
$ npm start
```

> **Note:** You'll likely see a "Not Secure" warning &mdash; it's because of the fake certificate we just generated.

## Usage

```sh
$ curl -k https://localhost:3000
#=> (200) Encrypted? true
```
