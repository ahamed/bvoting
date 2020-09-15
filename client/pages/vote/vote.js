import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import sha256 from 'crypto-js/sha256';
import Head from 'next/head';

import Layout from '../../components/layout/layout';
import Message from '../../components/message/message';
import Authorization from '../../components/Authorization/Authorization';
import Ballot from '../../components/Ballot/Ballot';

import styles from './vote.module.scss';

const Vote = ({ web3: { contracts, web3, accounts } }) => {
	const [voter, setVoter] = useState({
		name: '',
		mobile: '',
		secret: '',
		nid: '',
		region: '',
	});
	const [authorized, changeStatus] = useState(false);
	const [message, setMessage] = useState({ text: '', type: '' });
	const [candidates, setCandidates] = useState([]);

	useEffect(() => {
		if (authorized) {
			getCandidatesByRegion(voter.region);
		}
	}, [authorized]);

	const captureInputChange = (name, value) => {
		setVoter({ ...voter, [name]: value });
	};

	const handleAuthorization = event => {
		event.preventDefault();
		const { name, mobile, secret, nid, region } = voter;

		if (name && mobile && secret && nid && region) {
			const rowString = name + mobile + nid + secret;
			const voterHash = '0x' + sha256(rowString).toString();
			checkRegistrationStatus(nid, voterHash, region);
		} else {
			setMessage({ type: 'error', text: 'Fill the required fields.' });
		}
	};

	const checkRegistrationStatus = async (nid, hash, region) => {
		try {
			if (contracts?.registration !== undefined) {
				const {
					registration: { methods },
				} = contracts;
				const registered = await methods
					.authorizeVoter(
						web3.utils.asciiToHex(nid),
						hash,
						web3.utils.asciiToHex(region)
					)
					.call({ from: accounts[0] });

				if (registered) {
					changeStatus(true);
					setMessage({ type: 'success', text: 'Valid voter' });
				} else {
					changeStatus(false);
					setMessage({
						type: 'error',
						text: 'You are not registered or invalid information!',
					});
				}
			}
		} catch (e) {
			setMessage({ type: 'error', text: e.message });
			changeStatus(false);
		}
	};

	const getCandidatesByRegion = async region => {
		try {
			if (contracts?.CReg !== undefined) {
				const {
					CReg: { methods },
				} = contracts;
				const candidates = await methods
					.getCandidatesByRegion(web3.utils.asciiToHex(region))
					.call({ from: accounts[0] });

				if (candidates) {
					setCandidates(candidates);
					setMessage({ type: 'success', text: 'Valid voter' });
				} else {
					setCandidates([]);
					setMessage({ type: 'error', text: 'No candidate found!' });
				}
			}
		} catch (e) {
			setMessage({ type: 'error', text: e.message });
		}
	};

	return (
		<Layout>
			<Head>
				<title>Cast Vote</title>
			</Head>
			<div className='cast-vote'>
				<div className='voter-authorization'>
					<div className='columns'>
						<div className='column is-8'>
							{!authorized ? (
								<div className='box'>
									<h2 className='subtitle'>
										Voter Authorization
									</h2>
									<Authorization
										name={voter.name}
										mobile={voter.mobile}
										secret={voter.secret}
										nid={voter.nid}
										region={voter.region}
										inputChange={captureInputChange}
									/>
									<div className='columns'>
										<div className='column'>
											<button
												className='button is-dark is-pulled-right'
												onClick={handleAuthorization}
											>
												Authorized
											</button>
										</div>
									</div>
								</div>
							) : (
								<div className='box'>
									<h3 className='subtitle'>Ballot</h3>
									<Ballot
										candidates={candidates}
										setMessage={message =>
											setMessage(message)
										}
										voter={voter.nid}
									/>
								</div>
							)}
						</div>
						<div className='column is-4'>
							<Message
								type={message.type}
								message={message.text}
							/>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

const mapPropsToState = state => ({
	web3: state.web3,
});

export default connect(mapPropsToState)(Vote);
