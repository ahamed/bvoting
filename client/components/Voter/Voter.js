import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import styles from './voter.module.scss';

const Voter = ({ index, nid, web3: { web3, contracts, accounts } }) => {
	const [voter, setVoter] = useState({});

	useEffect(() => {
		(async () => {
			if (contracts) {
				const voter = await getVoter(nid);
				setVoter({ hash: voter[1], region: voter[2], coin: voter[3] });
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
		voter &&
		Object.keys(voter).length > 0 && (
			<tr className={styles['voter-item']}>
				<td>{index + 1}</td>
				<td>{web3.utils.hexToAscii(voter.region)}</td>
				{/* <td>{voter.region}</td> */}
				<td>{voter.hash}</td>
				<td>{voter.coin}</td>
			</tr>
		)
	);
};

const mapPropsToState = state => ({
	web3: state.web3,
});

export default connect(mapPropsToState)(Voter);
