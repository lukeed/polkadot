const { Server } = require('http');
const test = require('tape');
const fn = require('../');

const run = (fn, url, res) => fn({ url }, res);
const sleep = ms => new Promise(r => setTimeout(r, ms));

class Response {
	constructor(req={}) {
		this.body = '';
		this.headers = {};
		this.statusCode = 200;
		this.socket = {
			parser: { incoming:req }
		};
	}
	getHeader(key) {
		return this.headers[key.toLowerCase()];
	}
	setHeader(key, val) {
		this.headers[key.toLowerCase()] = val;
	}
	writeHead(code, obj={}) {
		this.statusCode = code;
		for (let k in obj) {
			this.setHeader(k, obj[k]);
		}
	}
	end(str) {
		this.finished = true;
		let type = this.getHeader('content-type');
		this.body = type && type.includes('application/json') ? JSON.parse(str) : str;
	}
}

test('polkadot', t => {
	t.is(typeof fn, 'function', 'exports a function');

	let out = fn();
	t.is(typeof out, 'object', 'returns an object');
	t.is(typeof out.listen, 'function', '~> has "listen" method');
	t.is(typeof out.handler, 'function', '~> has "handler" method');
	t.is(out.server, null, '~> has "server" key (default null)');

	t.end();
});

test('polkadot.listen', t => {
	t.plan(3);
	let foo = fn();
	let bar = foo.listen();
	t.true(bar instanceof Server, 'returns `http.Server` instance');
	t.ok(foo.server, '~> sets value for "server" key');
	t.same(bar, foo.server, '~~> identical to output');
	bar.close();
});

test('polkadot.handler', t => {
	t.throws(() => fn().handler(), TypeError, 'throws TypeError if no function passed');
	t.end();
});

test('polkadot.handler :: simple', t => {
	t.plan(7);

	let res = new Response();
	let { handler } = fn((req, res) => {
		t.is(req.path, '/hello/world', '~> req.path: "/hello/world" (parsed)');
		t.same(req.query, { foo:'1', bar:['2','3'] }, '~> req.query: { foo:1, bar:[2,3] } (parsed)');
		t.is(req.search, '?foo=1&bar=2&bar=3', '~> req.search: "?foo=1&bar=2&bar=3" (parsed)');

		res.setHeader('x-foo', 'x-bar');
		res.writeHead(418, { 'x-hello': 'x-world' });
		res.end('hello world');
	});

	run(handler, '/hello/world?foo=1&bar=2&bar=3', res);

	let headers = {
		'x-foo': 'x-bar',
		'x-hello': 'x-world',
	};

	t.true(res.finished, 'response terminates correctly');
	t.is(res.statusCode, 418, '~> statusCode');
	t.same(res.headers, headers, '~> headers');
	t.is(res.body, 'hello world', '~> body');
});

test('polkadot.handler :: return', t => {
	t.plan(7);

	let res = new Response();
	let { handler } = fn((req, res) => {
		t.is(req.path, '/alive', '~> req.path: "/alive" (parsed)');
		t.same(req.query, {}, '~> req.query: {} (default)');
		t.is(req.search, null, '~> req.search: null (default)');
		return { hello:123 };
	});

	run(handler, '/alive', res);

	let headers = {
		'content-type': 'application/json; charset=utf-8',
		'content-length': 13
	};

	t.true(res.finished, 'response terminates correctly');
	t.is(res.statusCode, 200, '~> statusCode');
	t.same(res.headers, headers, '~> headers');
	t.same(res.body, { hello:123 }, '~> body');
});

test('polkadot.handler :: return with Content-Type', t => {
	t.plan(7);

	let res = new Response();
	let { handler } = fn((req, res) => {
		t.is(req.path, '/alive', '~> req.path: "/alive" (parsed)');
		t.same(req.query, {}, '~> req.query: {} (default)');
		t.is(req.search, null, '~> req.search: null (default)');
		res.setHeader('Content-Type', 'application/json');
		return '{"hello":123}';
	});

	run(handler, '/alive', res);

	let headers = {
		'content-type': 'application/json',
		'content-length': 13
	};

	t.true(res.finished, 'response terminates correctly');
	t.is(res.statusCode, 200, '~> statusCode');
	t.same(res.headers, headers, '~> headers');
	t.same(res.body, { hello:123 }, '~> body');
});

test('polkadot.handler :: Promise', async t => {
	t.plan(7);

	let res = new Response();
	let { handler } = fn((req, res) => {
		t.is(req.path, '/delay', '~> req.path: "/delay" (parsed)');
		t.same(req.query, { key: 'items' }, '~> req.query: {} (parsed)');
		t.is(req.search, '?key=items', '~> req.search: "?key=items" (parsed)');
		return sleep(100).then(() => {
			res.statusCode = 201;
			let { key } = req.query;
			return { [key]:[1, 2, 3] };
		});
	});

	await run(handler, '/delay?key=items', res);

	let headers = {
		'content-type': 'application/json; charset=utf-8',
		'content-length': 17
	};

	t.true(res.finished, 'response terminates correctly');
	t.is(res.statusCode, 201, '~> statusCode');
	t.same(res.headers, headers, '~> headers');
	t.same(res.body, { items:[1,2,3] }, '~> body');
});

test('polkadot.handler :: async', async t => {
	t.plan(7);

	let res = new Response();
	let { handler } = fn(async (req, res) => {
		t.is(req.path, '/delay', '~> req.path: "/delay" (parsed)');
		t.same(req.query, { key: 'items' }, '~> req.query: {} (parsed)');
		t.is(req.search, '?key=items', '~> req.search: "?key=items" (parsed)');
		await sleep(100);
		res.statusCode = 201;
		let { key } = req.query;
		return { [key]:[1, 2, 3] };
	});

	await run(handler, '/delay?key=items', res);

	let headers = {
		'content-type': 'application/json; charset=utf-8',
		'content-length': 17
	};

	t.true(res.finished, 'response terminates correctly');
	t.is(res.statusCode, 201, '~> statusCode');
	t.same(res.headers, headers, '~> headers');
	t.same(res.body, { items:[1,2,3] }, '~> body');
});
