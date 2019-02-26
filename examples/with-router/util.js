/**
 * Overly simple JSON body parser
 */
exports.parse = function (req) {
	return new Promise((res, rej) => {
		let out = '';
		req.on('error', rej);
		req.on('data', x => {
			out += x;
		}).on('end', () => {
			try {
				res( JSON.parse(out) );
			} catch (err) {
				rej(err);
			}
		});
	});
}

function next(err) {
	if (err) throw err;
}

/**
 * Loop thru function handlers
 */
exports.loop = async function (arr, req, res) {
	let fn, out;
	for (fn of arr) {
		out = await fn(req, res, next) || out;
	}
	return out;
}
