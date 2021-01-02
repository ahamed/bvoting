import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import EthCrypto from 'eth-crypto';
import { nodeBase } from '../../utils';
import swal from 'sweetalert';

import Head from 'next/head';
import Layout from '../../components/layout/layout';

import Message from '../../components/message/message';
import voterData from '../../data/voterData.json';

const Verify = ({ web3: { contracts, web3, accounts } }) => {
	const [nid, setNID] = useState('');
	const [privateKey, setPrivateKey] = useState(null);

	useEffect(() => {
		getPrivateKey();
		return () => {};
	}, []);

	const getPrivateKey = async () => {
		const url = `${nodeBase}/private-key`;
		const resp = await fetch(url);
		const data = await resp.json();
		if (data?.key !== undefined) {
			setPrivateKey(data.key);
		} else {
			swal('Error', 'Private key not found!', 'error');
		}
	};

	const handleChange = event => {
		event.preventDefault();
		const { value } = event.target;
		setNID(value);
	};

	const verifyVote = async event => {
		event.preventDefault();

		if (!nid) {
			swal('Error', 'Please enter your NID first!', 'error');
			return;
		}

		try {
			if (contracts.vote) {
				const { methods } = contracts.vote;
				const resp = await methods
					.verifyVote(web3.utils.asciiToHex(nid))
					.call({ from: accounts[0] });

				if (resp) {
					const candidateNID = await EthCrypto.decryptWithPrivateKey(
						privateKey,
						JSON.parse(resp)
					);
					if (candidateNID) {
						const cid = await web3.utils.hexToAscii(candidateNID);
						const candidateInfo = voterData.find(
							item => +item.nid === parseInt(cid)
						);

						swal(
							'Found',
							`You have successfully voted "${candidateInfo.name}"`,
							'success'
						);
					}
				} else {
					swal('Not found', "You don't vote yet!", 'error');
				}
			}
		} catch (e) {
			swal('Error', e.message, 'error');
		}
	};

	return (
		<Layout>
			<Head>
				<title>Verify Vote</title>
			</Head>
			<div className='verify-vote'>
				<div className='columns'>
					<div className='column'>
						<div className='box has-text-centered'>
							<h2 className='subtitle'>Verify Your Vote</h2>
							<div className='columns'>
								<div className='column is-4 is-offset-4'>
									<input
										type='text'
										className='input'
										name='nid'
										value={nid}
										onChange={handleChange}
										placeholder='Enter your NID'
									/>
									<button
										className='button is-dark'
										style={{ marginTop: '20px' }}
										onClick={verifyVote}
									>
										Verify
									</button>
								</div>
							</div>
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

export default connect(mapPropsToState)(Verify);
