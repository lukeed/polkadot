const { get } = require('httpie');
const { loop } = require('./util');

function isUser(req, res, next) {
	// TODO: some logic to check if is a User
	next();
}

function getPost(req, res, next) {
	let id = parseInt(req.query.id, 10);
	if (!id) return next('Invalid "id" parameter');
	return get(`https://jsonplaceholder.typicode.com/posts/${id}`).then(r => r.data);
}

function setHeaders(req, res, next) {
	res.setHeader('X-Foobar', 'Hello world');
	res.setHeader('Cache-Control', 'public, max-age=30');
}

const group = [isUser, getPost, setHeaders];

module.exports = async function (req, res) {
	try {
		return await loop(group, req, res);
	} catch (err) {
		// Error handler
		res.statusCode = 400;
		return err.message || err;
	}
}
