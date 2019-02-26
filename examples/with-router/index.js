const send = require('@polka/send-type');
const { loop } = require('./util');
const App = require('./router');

module.exports = async function (req, res) {
	let obj = App.find(req.method, req.url);
	if (!obj) return send(res, 404, 'Not found');

	try {
		req.params = obj.params;
		return await loop(obj.handlers, req, res);
	} catch (err) {
		send(res, err.statusCode || 400, err.message || err);
	}
}
