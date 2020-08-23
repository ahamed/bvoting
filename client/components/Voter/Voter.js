import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

const Voter = ({ nid, web3: { contracts, accounts } }) => {
	const [voter, setVoter] = useState('');

	useEffect(() => {
		(async () => {
			if (contracts) {
				const voter = await getVoter(nid);
				console.log('voter voter', voter);
				setVoter(voter[1]);
			}
		})();
	}, [nid, contracts, accounts]);

	const getVoter = async nid => {
		const voter = contracts.registration.methods
			.getVoter(nid)
			.call({ from: accounts[0] });
		return voter;
	};

	return <li>{voter}</li>;
};

const mapPropsToState = state => ({
	web3: state.web3,
});

export default connect(mapPropsToState)(Voter);
