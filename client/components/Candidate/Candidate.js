import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import parties from '../../data/parties';

import styles from './Candidate.module.scss';

const Candidate = ({ index, nid, web3: { contracts, accounts, web3 } }) => {
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
			<tr>
				<td>{index + 1}</td>
				<td>{web3.utils.hexToAscii(candidate.name)}</td>
				<td>{web3.utils.hexToAscii(candidate.region)}</td>
				<td>{parties[candidate.partyId].name}</td>
				<td>
					<img
						src={parties[candidate.partyId].src}
						alt={parties[candidate.partyId].name}
						width={30}
					/>
				</td>
				<td>{candidate.votes}</td>
			</tr>
		)
	);
};

const mapPropsToState = state => ({
	web3: state.web3,
});

export default connect(mapPropsToState)(Candidate);
