module.exports = function (req) {
	let { name='world' } = req.query;
	return `hello, ${name}`;
}
