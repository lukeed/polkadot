const test = require('tape');
const fn = require('../');

test('polkadot', t => {
	t.is(typeof fn, 'function', 'exports a function');
	t.end();
});
