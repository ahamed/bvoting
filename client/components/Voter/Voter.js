import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import styles from './voter.module.scss';

const Voter = ({ nid, web3: { contracts, accounts } }) => {
	const [voter, setVoter] = useState('');

	useEffect(() => {
		(async () => {
			if (contracts) {
				const voter = await getVoter(nid);
				setVoter({ hash: voter[1], coin: voter[4] });
			}
		})();
	}, [nid, contracts, accounts]);

	const getVoter = async nid => {
		const voter = contracts.registration.methods
			.getVoter(nid)
			.call({ from: accounts[0] });
		return voter;
	};

	return (
		<li className={styles['voter-item']}>
			<div>
				<div>{voter.hash}</div>
				<strong>coin: </strong> {voter.coin}
			</div>
		</li>
	);
};

const mapPropsToState = state => ({
	web3: state.web3,
});

export default connect(mapPropsToState)(Voter);
