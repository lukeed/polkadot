#!/usr/bin/env node
const { resolve } = require('path');
const polkadot = require('.');

const argv = process.argv.slice(2);
const entry = resolve(argv.shift() || 'index.js');
const { PORT=3000 } = process.env;

try {
	const handler = require(entry);
	polkadot(handler).listen(PORT, err => {
		if (err) throw err;
		console.log(`Running on http://localhost:${PORT}`);
	});
} catch (err) {
	if (err.code !== 'MODULE_NOT_FOUND') throw err;
	console.error(err.message);
	return process.exit(1);
}
