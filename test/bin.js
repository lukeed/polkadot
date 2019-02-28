const test = require('tape');
const { join } = require('path');
const { spawn, spawnSync } = require('child_process');
const { get } = require('httpie');

const BIN = require.resolve('../bin');
const fixtures = join(__dirname, 'fixtures');

function run(file='', opts={}) {
	if (file) file=join(fixtures, file);
	opts = { detached:true, cwd:fixtures, ...opts };
	let pid = spawn('node', [BIN, file], opts);
	return new Promise((res, rej) => {
		pid.stdout.on('data', () => res(pid));
		pid.on('exit', rej);
	});
}

test('(bin) throw if missing', t => {
	let file = join(fixtures, 'missing.js');
	let pid = spawnSync('node', [BIN, file]);
	t.is(pid.status, 1, 'exits with non-zero code');
	t.is(pid.stderr.toString().trim(), `Cannot find module '${file}'`, '~> stderr has message');
	t.is(pid.stdout.toString().trim(), '', '~> stdout is empty');
	t.end();
});

test('(bin) throw if syntax error', t => {
	let file = join(fixtures, 'syntax.js');
	let pid = spawnSync('node', [BIN, file]);
	t.is(pid.status, 1, 'exits with non-zero code');
	t.true(pid.stderr.toString().includes('SyntaxError: Unexpected token'), '~> stderr has "SyntaxError: Unexpected token" message');
	t.is(pid.stdout.toString().trim(), '', '~> stdout is empty');
	t.end();
});

test('(bin) entry :: default', async t => {
	let pid = await run();
	let { data, statusCode, headers } = await get('http://localhost:3000');
	t.is(headers['content-type'], 'text/plain');
	t.is(headers['content-length'], '5');
	t.is(statusCode, 200);
	t.is(data, 'index');
	pid.kill();
	t.end();
});

test('(bin) entry :: end', async t => {
	let pid = await run('end.js');

	let res1 = await get('http://localhost:3000');
	t.is(res1.headers['content-length'], '12');
	t.is(res1.data, 'hello, world');
	t.is(res1.statusCode, 200);

	let res2 = await get('http://localhost:3000?name=foobar');
	t.is(res2.headers['content-length'], '13');
	t.is(res2.data, 'hello, foobar');
	t.is(res2.statusCode, 200);

	pid.kill();
	t.end();
});

test('(bin) entry :: return', async t => {
	let pid = await run('return.js');

	let res1 = await get('http://localhost:3000');
	t.is(res1.headers['content-type'], 'text/plain');
	t.is(res1.headers['content-length'], '12');
	t.is(res1.data, 'hello, world');
	t.is(res1.statusCode, 200);

	let res2 = await get('http://localhost:3000?name=foobar');
	t.is(res2.headers['content-type'], 'text/plain');
	t.is(res2.headers['content-length'], '13');
	t.is(res2.data, 'hello, foobar');
	t.is(res2.statusCode, 200);

	pid.kill();
	t.end();
});

test('(bin) entry :: promise', async t => {
	let pid = await run('promise.js');

	let t1 = Date.now();
	let res1 = await get('http://localhost:3000');
	t.true(Date.now() - t1 > 100, '~> waited at least 100ms');
	t.is(res1.headers['content-type'], 'text/plain');
	t.is(res1.headers['content-length'], '12');
	t.is(res1.data, 'hello, world');
	t.is(res1.statusCode, 200);

	let t2 = Date.now();
	let res2 = await get('http://localhost:3000?name=foobar');
	t.true(Date.now() - t2 > 100, '~> waited at least 100ms');
	t.is(res2.headers['content-type'], 'text/plain');
	t.is(res2.headers['content-length'], '13');
	t.is(res2.data, 'hello, foobar');
	t.is(res2.statusCode, 200);

	pid.kill();
	t.end();
});

test('(bin) entry :: async', async t => {
	let pid = await run('async.js');

	let t1 = Date.now();
	let res1 = await get('http://localhost:3000');
	t.true(Date.now() - t1 > 100, '~> waited at least 100ms');
	t.is(res1.headers['content-type'], 'text/plain');
	t.is(res1.headers['content-length'], '12');
	t.is(res1.data, 'hello, world');
	t.is(res1.statusCode, 200);

	let t2 = Date.now();
	let res2 = await get('http://localhost:3000?name=foobar');
	t.true(Date.now() - t2 > 100, '~> waited at least 100ms');
	t.is(res2.headers['content-type'], 'text/plain');
	t.is(res2.headers['content-length'], '13');
	t.is(res2.data, 'hello, foobar');
	t.is(res2.statusCode, 200);

	pid.kill();
	t.end();
});

test('(bin) PORT', async t => {
	let PORT = process.env.PORT = 5000;
	let pid = await run('return.js');

	let res = await get(`http://localhost:${PORT}`);
	t.is(res.headers['content-type'], 'text/plain');
	t.is(res.headers['content-length'], '12');
	t.is(res.data, 'hello, world');
	t.is(res.statusCode, 200);

	pid.kill();
	t.end();
});
