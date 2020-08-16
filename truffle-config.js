const path = require('path');

module.exports = {
	// See <http://truffleframework.com/docs/advanced/configuration>
	// to customize your Truffle configuration!
	contracts_build_directory: path.join(
		__dirname,
		'client/ethereum/contracts'
	),
	networks: {
		develop: {
			host: '127.0.0.1',
			port: 7545,
			network_id: '*',
			gas: 8721975,
		},
	},
};
