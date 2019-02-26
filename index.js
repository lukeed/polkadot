const { createServer } = require('http');
const { parse } = require('querystring');
const send = require('@polka/send-type');
const url = require('@polka/url');

function loop(res, out) {
	if (res.finished) return;
	return out && out.then !== void 0
		? out.then(d => loop(res, d)) : send(res, res.statusCode || 200, out);
}

module.exports = function (handler) {
	const $ = {
		server: null,

		handler(req, res) {
			const info = url(req);
			req.path = info.pathname;
			req.query = info.query ? parse(info.query) : {};
			req.search = info.search;

			return loop(res, handler(req, res));
		},

		listen() {
			const handler = (r1, r2) => setImmediate($.handler, r1, r2);
			($.server = $.server || createServer()).on('request', handler);
			return $.server.listen.apply($.server, arguments);
		}
	};

	return $;
}
