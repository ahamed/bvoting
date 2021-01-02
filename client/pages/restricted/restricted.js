import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import EthCrypto from 'eth-crypto';
import { sha256 } from 'ethereumjs-util';
import { nodeBase } from '../../utils';
import swal from 'sweetalert';

import Head from 'next/head';
import Layout from '../../components/layout/layout';

import Message from '../../components/message/message';

import styles from './restricted.module.scss';

import MerkleTreeHelper from '../../merkleTree';
import { arrayBufferToHex } from '../../utils';

const Restricted = ({ web3: { contracts, web3, accounts } }) => {
	const [loading, setLoading] = useState(false);
	const [counting, setCounting] = useState(false);
	const [done, setDone] = useState(false);
	const [candidates, setCandidate] = useState([]);
	const [privateKey, setPrivateKey] = useState(null);
	const [hashes, setHashes] = useState([]);
	const [generatingTree, setGeneration] = useState(false);
	const [tree, setTree] = useState(null);
	const [merkleRoot, setRoot] = useState(null);
	const [tnx, setTnx] = useState('');
	const [copyMsg, setMsg] = useState('');

	let timeout = null;
	const router = useRouter();

	useEffect(() => {
		checkKeys();
		getPrivateKey();

		return () => {
			clearTimeout(timeout);
		};
	}, [web3, accounts]);

	const getBlockTransactionHashes = async () => {
		if (web3 && accounts) {
			const { eth } = web3;
			const lastBlock = await eth.getBlockNumber();
			const range = [...Array(lastBlock).keys()].map(k => k + 1);

			const promises = [];
			range.forEach(blockNumber => {
				promises.push(eth.getBlock(blockNumber));
			});
			Promise.all(promises).then(data => {
				if (data && data.length) {
					data = data.map(item => item.transactions[0]);
					setHashes(data);
				}
			});
		}
	};

	const changeTnx = event => {
		event.preventDefault();
		setTnx(event.target.value);
	};

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

	const generateMerkleTree = event => {
		event.preventDefault();
		getBlockTransactionHashes();
		if (hashes.length) {
			setGeneration(true);
			const elements = [...hashes].map(hash => sha256(hash));
			console.log('elements', elements);
			const merkleTree = new MerkleTreeHelper(elements);
			setTree(merkleTree);
			setRoot(arrayBufferToHex(merkleTree.getRoot()));
			setGeneration(false);
		}
	};

	const checkProof = async event => {
		event.preventDefault();
		if (tnx.length) {
			try {
				console.log(sha256(tnx));
				const response = await tree.checkProof(sha256(tnx));
				if (response) {
					swal(
						'Valid',
						'The transaction is proved as valid!',
						'success'
					);
				} else {
					swal('Invalid', 'The transaction is not valid!', 'error');
				}
			} catch (e) {
				swal('Error', e.message, 'error');
			}
		} else {
			swal('Error', 'Enter a transaction hash', 'error');
		}
		setTnx('');
	};

	const copyToClipboard = (event, hash) => {
		event.preventDefault();
		navigator.clipboard.writeText(hash);
		setMsg(hash);

		setTimeout(() => {
			setMsg('');
		}, 1000);
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
							<h2 className='subtitle'>
								Create the election and make it available for
								voters.
							</h2>
							<button className='button is-dark'>
								Create Election
							</button>
						</div>
					</div>
				</div>
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

				<div className='columns'>
					<div className='column'>
						<div className='box has-text-centered'>
							<h2 className='subtitle'>Generate Merkle Tree</h2>
							<button
								className='button is-success'
								onClick={generateMerkleTree}
							>
								{generatingTree
									? 'Generating...'
									: 'Generate Tree'}
							</button>

							{merkleRoot && (
								<div>
									<div
										className='merkle-root'
										style={{ marginTop: '40px' }}
									>
										<h2 className='subtitle'>
											<strong>The MerkleRoot: </strong>
											{merkleRoot}
										</h2>
										<hr />
										<h2 className='subtitle'>
											Transactions
										</h2>
										<table className='table is-fullwidth is-striped'>
											<thead>
												<tr>
													<th>#</th>
													<th>Hash</th>
													<th>Copy</th>
												</tr>
											</thead>
											<tbody>
												{hashes.length &&
													hashes.map((hash, i) => (
														<tr key={i}>
															<td>{i + 1}</td>
															<td>{hash}</td>
															<th
																className={
																	styles[
																		'copy-wrapper'
																	]
																}
															>
																<span
																	className={`far fa-copy ${styles['copy-icon']}`}
																	onClick={e =>
																		copyToClipboard(
																			e,
																			hash
																		)
																	}
																></span>
																{copyMsg &&
																	copyMsg ===
																		hash && (
																		<span
																			className={
																				styles[
																					'copy-msg'
																				]
																			}
																		>
																			Copied!
																		</span>
																	)}
															</th>
														</tr>
													))}
											</tbody>
										</table>
									</div>

									<div
										className='merkle-proof'
										style={{ marginTop: '20px' }}
									>
										<h2 className='subtitle'>
											Merkle Proof
										</h2>
										<div className='columns'>
											<div className='column is-6 is-offset-3'>
												<input
													type='text'
													className='input'
													value={tnx}
													name='tnx'
													onChange={changeTnx}
													placeholder='Enter a transaction hash for checking the integrity'
												/>
												<button
													className='button is-primary'
													style={{
														marginTop: '20px',
													}}
													onClick={checkProof}
												>
													Proof
												</button>
											</div>
										</div>
									</div>
								</div>
							)}
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
