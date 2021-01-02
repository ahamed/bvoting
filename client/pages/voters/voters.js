import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';

import Layout from '../../components/layout/layout';
import Voter from '../../components/Voter/Voter';
import Message from '../../components/message/message';

import styles from './voters.module.scss';

const Voters = ({ web3: { contracts, web3, accounts } }) => {
	const [voters, setVoters] = useState([]);
	const [message, setMessage] = useState({ text: '', type: '' });

	useEffect(() => {
		getVoters();

		return () => {};
	}, [contracts, accounts]);

	const getVoters = async () => {
		try {
			if (contracts.registration) {
				const voters = await contracts.registration.methods
					.getVoters()
					.call({
						from: accounts[0],
					});
				setVoters(voters);
				setMessage({
					type: 'success',
					text: `${voters.length} voters registered.`,
				});
			}
		} catch (e) {
			setMessage({ type: 'error', text: e.message });
			console.error(e);
		}
	};
	return (
		<Layout>
			<Head>
				<title>Voters</title>
			</Head>
			<div className='voters-list'>
				<div className='columns'>
					<div className='column'>
						<div className='box'>
							<h3 className='subtitle'>Registered Voters</h3>
							{voters && voters.length > 0 ? (
								<table className='table is-fullwidth'>
									<thead>
										<th>#</th>
										<th>Region</th>
										<th>Hash</th>
										<th>Vote Coin</th>
									</thead>
									{voters.map((voter, index) => (
										<Voter
											key={index}
											index={index}
											nid={voter}
										/>
									))}
								</table>
							) : (
								<p
									className='subtitle has-text-danger has-text-centered'
									style={{ padding: '40px' }}
								>
									No voter registered!
								</p>
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

export default connect(mapPropsToState)(Voters);
