import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import EthCrypto from 'eth-crypto';
import { nodeBase } from '../../utils';

import parties from '../../data/parties';

import styles from './Ballot.module.scss';
import Candidate from '../Candidate/Candidate';
import swal from 'sweetalert';
import { inTime } from '../../utils';

const Ballot = ({
	setMessage,
	voter,
	candidates,
	web3: { contracts, accounts, web3 },
}) => {
	const [candidateData, setData] = useState([]);
	const [vote, setVote] = useState(null);
	const [publicKey, setPublicKey] = useState(null);

	useEffect(() => {
		if (candidates.length > 0) {
			candidates.forEach(nid => {
				getCandidate(nid);
			});
		}

		getPublicKey();
	}, [candidates, contracts, accounts]);

	const getPublicKey = async () => {
		const url = `${nodeBase}/public-key`;
		const resp = await fetch(url);
		const data = await resp.json();
		if (data?.key !== undefined) {
			setPublicKey(data.key);
		} else {
			swal('Error', 'No public key generated yet!', 'error');
		}
	};

	const getCandidate = async nid => {
		const candidate = await contracts.CReg.methods
			.getCandidate(nid)
			.call({ from: accounts[0] });
		if (candidate) {
			const object = {
				name: web3.utils.hexToAscii(candidate[0]),
				region: web3.utils.hexToAscii(candidate[2]),
				partyId: candidate[3],
				nid: nid,
			};
			console.log(object);
			setData(prevData => [...prevData, object]);
		}
	};

	const handleChange = event => {
		setVote(event.target.value);
		console.log(event.target.value);
	};

	const handleVoteCasting = async event => {
		event.preventDefault();

		if (!inTime()) {
			swal(
				'Invalid',
				'Invalid time span for casting vote! You are too early or late for casting vote.',
				'error'
			);
			return;
		}

		// swal({
		// 	html: true,
		// 	icon: 'success',
		// 	title: 'Success',
		// 	text: 'Vote casted successfully! Your vote id is "8779040598". You can check your vote after finishing the vote counting by using this vote ID.'
		// });

		if (!vote) {
			setMessage({ type: 'error', text: 'Select a candidate first!' });
			return;
		}

		try {
			if (contracts) {
				const {
					CReg: { methods },
					registration: { methods: rMethod },
					vote: { methods: vMethod },
				} = contracts;

				const validVoter = await rMethod
					.voterCanVote(web3.utils.asciiToHex(voter))
					.call({ from: accounts[0] });
				const validCandidate = await methods
					.isAlreadyRegistered(vote)
					.call({ from: accounts[0] });

				if (!validVoter) {
					setMessage({
						type: 'error',
						text:
							'You are not eligible for casting vote. It seems that you have already casted the vote.',
					});
					return;
				}

				if (!validCandidate) {
					setMessage({
						type: 'error',
						text:
							'Something went wrong! May be candidate not registered.',
					});
					return;
				}

				// await methods
				// 	.addVoteForCandidate(vote)
				// 	.send({ from: accounts[0] });

				await rMethod
					.removeVoteCoinFromTheVoter(web3.utils.asciiToHex(voter))
					.send({ from: accounts[0] });

				const voterID = web3.utils.asciiToHex(voter);
				const candidate = await EthCrypto.encryptWithPublicKey(
					publicKey,
					vote
				);

				await vMethod
					.addVote(voterID, JSON.stringify(candidate))
					.send({ from: accounts[0] });

				setMessage({
					type: 'success',
					text: 'Vote casted successfully!',
				});
			}
		} catch (e) {
			console.log(e.message);
			setMessage({
				type: 'error',
				text: e.message,
			});
		}
	};

	return (
		<div className='ballot'>
			{candidateData.length > 0 && (
				<div>
					<table className='table is-hoverable is-striped is-fullwidth'>
						<thead>
							<tr>
								<th>#</th>
								<th>Candidate Name</th>
								<th>Party Name</th>
								<th>Party Symbol</th>
								<th>Select</th>
							</tr>
						</thead>
						<tbody>
							{candidateData.map((data, index) => (
								<tr key={index}>
									<td>{index + 1}</td>
									<td>{data.name}</td>
									<td>{parties[data.partyId].name}</td>
									<td>
										<img
											src={parties[data.partyId].src}
											alt=''
											width={30}
										/>
									</td>
									<td>
										<input
											type='radio'
											name='vote'
											value={data.nid}
											selected={data.nid === vote}
											onChange={handleChange}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className='columns'>
						<div className='column has-text-centered'>
							<button
								className='button is-dark'
								onClick={handleVoteCasting}
							>
								Cast Vote
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

const mapPropsToState = state => ({
	web3: state.web3,
});

export default connect(mapPropsToState)(Ballot);
