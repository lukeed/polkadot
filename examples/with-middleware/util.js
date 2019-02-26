function next(err) {
	if (err) throw err;
}

exports.loop = async function (arr, req, res) {
	let out, fn;
	for (fn of arr) {
		out = await fn(req, res, next) || out;
	}
	return out;
};
