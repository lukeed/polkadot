module.exports = function (req, res) {
	let { name='world' } = req.query;
	res.end(`hello, ${name}`);
}
