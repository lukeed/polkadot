const { get } = require('httpie');

module.exports = async function () {
	const res = await get('https://hnpwa.com/api/v0/news.json');
	return res.data;
}
