const sleep = ms => new Promise(r => setTimeout(r, ms));

module.exports = async function (req) {
	await sleep(100);
	console.log('> here');
	let { name='world' } = req.query;
	return `hello, ${name}`;
}
