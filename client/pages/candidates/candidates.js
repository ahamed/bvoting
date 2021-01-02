import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Head from 'next/head';
import Layout from '../../components/layout/layout';
import Message from '../../components/message/message';
import Candidate from '../../components/Candidate/Candidate';

import styles from './candidates.module.scss';

const Candidates = ({ web3: { contracts, accounts, web3 } }) => {
	const [candidates, setCandidates] = useState([]);
	const [message, setMessage] = useState({ text: '', type: '' });

	useEffect(() => {
		getCandidates();
	}, [contracts, accounts]);

	const getCandidates = async () => {
		try {
			if (contracts.CReg) {
				const candidates = await contracts.CReg.methods
					.getCandidates()
					.call({
						from: accounts[0],
						gas: 3000000,
					});
				setCandidates(candidates);
				setMessage({
					type: 'success',
					text: `${candidates.length} candidates are registered!`,
				});
			}
		} catch (e) {
			setMessage({ type: 'error', text: e.message });
		}
	};

	return (
		<Layout>
			<Head>
				<title>Registered Candidates</title>
			</Head>
			<div className='candidates-list'>
				<div className='columns'>
					<div className='column'>
						<div className={`box ${styles['candidate-list']}`}>
							<h2 className='subtitle'>Registered Candidates</h2>
							{candidates && candidates.length > 0 ? (
								<table className='table is-fullwidth is-striped'>
									<thead>
										<tr>
											<th>#</th>
											<th>Name</th>
											<th>Region</th>
											<th>Party Name</th>
											<th>Party Symbol</th>
											<th>Votes</th>
										</tr>
									</thead>
									<tbody>
										{candidates.map((candidate, index) => (
											<Candidate
												key={candidate}
												nid={candidate}
												index={index}
											/>
										))}
									</tbody>
								</table>
							) : (
								<p
									className='subtitle has-text-danger has-text-centered'
									style={{ padding: '40px' }}
								>
									No candidate registered!
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

const mapStateToProps = state => ({
	web3: state.web3,
});

export default connect(mapStateToProps)(Candidates);
