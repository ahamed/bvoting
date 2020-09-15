import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import parties from '../../data/parties';

import styles from './Candidate.module.scss';

const Candidate = ({ nid, web3: { contracts, accounts, web3 } }) => {
	const [candidate, setCandidate] = useState({});

	useEffect(() => {
		(async () => {
			if (contracts) {
				const candidate = await getCandidate(nid);
				console.log(candidate);
				setCandidate({
					name: candidate[0],
					region: candidate[2],
					partyId: candidate[3],
					votes: candidate[4],
				});
			}
		})();
		console.log(parties);
	}, [nid, contracts, accounts]);

	const getCandidate = async nid => {
		const candidate = contracts.CReg.methods
			.getCandidate(nid)
			.call({ from: accounts[0] });
		return candidate;
	};

	return (
		candidate &&
		Object.values(candidate).length > 0 && (
			<li className={styles['candidate-item']}>
				<div>
					<strong>Name: </strong>{' '}
					<span>{web3.utils.hexToAscii(candidate.name)}</span>
				</div>
				<div>
					<strong>Party Name: </strong>{' '}
					<span
						className={`${styles['party-symbol']} ${
							parties[candidate.partyId].symbol
						}`}
						style={{ color: parties[candidate.partyId].color }}
					></span>
					<span className={styles['party-name']}>
						{parties[candidate.partyId].name}
					</span>
				</div>
				<div>
					<strong>Region: </strong>
					<span>{web3.utils.hexToAscii(candidate.region)}</span>
				</div>
				<div>
					<strong>Votes: </strong>
					<span>{candidate.votes}</span>
				</div>
			</li>
		)
	);
};

const mapPropsToState = state => ({
	web3: state.web3,
});

export default connect(mapPropsToState)(Candidate);
