const { createServer } = require('https');
const { readFileSync } = require('fs');
const polkadot = require('polkadot');

const { PORT=3000 } = process.env;

// Attach handler function
const app = polkadot((req, res) => {
	res.end(`Encrypted? ${req.client.encrypted}`);
});

// Overwrite `server` for HTTPS
app.server = createServer({
	key: readFileSync('ssl/foobar.key'),
	cert: readFileSync('ssl/foobar.crt')
});

// Start the service
app.listen(PORT, () => {
	console.log(`Running on http://localhost:${PORT}`);
});
