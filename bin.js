#!/usr/bin/env node
const { resolve } = require('path');
const { existsSync } = require('fs');

const { PORT=3000 } = process.env;
const argv = process.argv.slice(2);
const entry = resolve(argv.shift() || 'index.js');

if (!existsSync(entry)) {
	console.error('Entry file does not exist:', entry);
	process.exit(1);
}

const handler = require(entry);
const polkadot = require('.');

polkadot(handler).listen(PORT, err => {
	if (err) throw err;
	console.log(`Running on localhost:${PORT}`);
});
