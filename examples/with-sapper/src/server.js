import sirv from 'sirv';
import polkadot from 'polkadot';
import * as sapper from '../__sapper__/server.js';
import { loop } from './util';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const assets = sirv('static', { dev });

// Define the order of our middleware:
//   1) Try to match files within "/static/**"
//   2) If no files found, let Sapper do whatever it wants.
// PS – We wrap `sirv` in Promise for "loop" helper
const middleware = [
	(req, res) => new Promise(r => assets(req, res, r)),
	sapper.middleware()
];

polkadot(async (req, res) => {
	req.originalUrl = req.url; // for Sapper
	await loop(middleware, req, res);
}).listen(PORT, err => {
	if (err) console.log('error', err);
});
