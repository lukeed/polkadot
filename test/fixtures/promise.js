const sleep = ms => new Promise(r => setTimeout(r, ms));

module.exports = function (req) {
	let { name='world' } = req.query;
	return sleep(100).then(() => `hello, ${name}`);
}
