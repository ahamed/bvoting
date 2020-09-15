import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';

import EthCrypto from 'eth-crypto';
import { nodeBase } from '../../utils';
import swal from 'sweetalert';

import Head from 'next/head';
import Layout from '../../components/layout/layout';

import Message from '../../components/message/message';

import styles from './restricted.module.scss';

const Restricted = ({ web3: { contracts, web3, accounts } }) => {
	const [loading, setLoading] = useState(false);
	const [counting, setCounting] = useState(false);
	const [done, setDone] = useState(false);
	const [candidates, setCandidate] = useState([]);
	const [privateKey, setPrivateKey] = useState(null);

	let timeout = null;
	const router = useRouter();

	useEffect(() => {
		checkKeys();
		getPrivateKey();
		return () => {
			clearTimeout(timeout);
		};
	}, []);

	const checkKeys = async () => {
		const url = `${nodeBase}/check-keys`;
		const resp = await fetch(url);
		const data = await resp.json();
		setDone(data);
	};

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

	const generateKeys = event => {
		event.preventDefault();

		setLoading(true);

		timeout = setTimeout(async () => {
			const identity = EthCrypto.createIdentity();
			const url = `${nodeBase}/store-keys`;
			const resp = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(identity),
			});

			const data = await resp.json();

			if (data) {
				setDone(true);
				swal('Success', 'Keys Generated successfully!', 'success');
			} else {
				setDone(false);
				swal(
					'Error',
					'Opps! Something went wrong. No key generated!',
					'error'
				);
			}

			setLoading(false);
		}, 2000);
	};

	const startCounting = async event => {
		event.preventDefault();
		try {
			if (contracts.vote) {
				const isCounted = await contracts.vote.methods
					.isAlreadyCounted()
					.call({ from: accounts[0] });

				if (isCounted) {
					swal(
						'Warning',
						'The votes have already been counted!',
						'warning'
					);
					return;
				}

				const candidates = await contracts.vote.methods
					.getCandidates()
					.call({ from: accounts[0] });

				if (candidates) {
					const promises = [];
					candidates.forEach(encrypted => {
						promises.push(
							EthCrypto.decryptWithPrivateKey(
								privateKey,
								JSON.parse(encrypted)
							)
						);
					});

					if (promises.length > 0) {
						Promise.all(promises).then(async ids => {
							// Change counted state
							contracts.vote.methods
								.markAsCounted()
								.send({ from: accounts[0] });

							/**
							 * Update candidate accounts
							 */
							if (contracts.CReg) {
								const resp = await contracts.CReg.methods
									.addVotesToTheAccount(ids)
									.send({ from: accounts[0] });
								if (resp) {
									swal(
										'Success',
										'Congratulations! The vote counting completed successfully!',
										'success'
									).then(_ => router.push('/candidates'));
								}
							} else {
								swal('Error', 'Something went wrong!', 'error');
							}
						});
					}
				} else {
					swal('Warning', 'No vote found!', 'warning');
				}
			}
		} catch (e) {
			swal('Error', e.message, 'error');
		}
	};

	return (
		<Layout>
			<Head>
				<title>EC Area</title>
			</Head>
			<div className='restricted-area'>
				<div className='columns'>
					<div className='column'>
						<div className='box has-text-centered'>
							<h2 className='subtitle has-text-success'>
								{done
									? 'You have already generated the keys.'
									: 'Generate Keys For Encryption'}
							</h2>
							<button
								className={`button ${
									done ? 'is-danger' : 'is-dark'
								}`}
								onClick={generateKeys}
							>
								{loading
									? 'Generating...'
									: done
									? 'Generate Again'
									: 'Generate keys'}
							</button>
						</div>
					</div>
				</div>

				<div className='columns'>
					<div className='column'>
						<div className='box has-text-centered'>
							<h2 className='subtitle'>Start Vote Counting</h2>
							<button
								className='button is-dark'
								onClick={startCounting}
							>
								Start Counting
							</button>
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

export default connect(mapPropsToState)(Restricted);
