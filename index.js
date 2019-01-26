const { createServer } = require('http');
const { parse } = require('querystring');
const send = require('@polka/send-type');
const url = require('@polka/url');

module.exports = function (handler) {
	const $ = {
		server: null,

		async handler(req, res) {
			const info = url(req);
			req.path = info.pathname;
			req.query = info.query ? parse(info.query) : {};
			req.search = info.search;

			const out = await handler(req, res);
			res.finished || out && send(res, res.statusCode || 200, out);
		},

		listen() {
			const handler = (r1, r2) => setImmediate($.handler.bind(null, r1, r2));
			($.server = $.server || createServer()).on('request', handler);
			return $.server.listen.apply($.server, arguments);
		}
	};

	return $;
};
