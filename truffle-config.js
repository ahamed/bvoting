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
			gas: 4500000,
		},
	},
	compilers: {
		solc: {
			parser: 'solcjs',
			evmVersion: 'byzantium',
			settings: {
				// See the solidity docs for advice about optimization and evmVersion
				optimizer: {
					enabled: true,
					runs: 200,
				},
			},
		},
	},
};
