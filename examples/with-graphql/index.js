const { post } = require('httpie');

// Save the endpoint we'll hit
const API = 'https://graphql-pokemon.now.sh';

// Prepare simple query
const query = `
  query Query($name: String!) {
    pokemon(name: $name) {
      number
      name
      attacks {
				special {
					name
					type
				}
			}
    }
  }
`;

module.exports = async function (req) {
	// Parse the name from query params
	const { name='Pikachu' } = req.query;

	// Perform query
	const variables = { name };
	const body = { query, variables };
	const { data } = await post(API, { body });

	// Return the Pokemon
	return data.data.pokemon;
}
