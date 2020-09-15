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
					<div className='column is-8'>
						<div className='box'>
							<h3 className='subtitle'>Registered Voters Hash</h3>
							{voters && (
								<ol className={styles['voter-list']}>
									{voters.map(voter => (
										<Voter key={voter} nid={voter} />
									))}
								</ol>
							)}
						</div>
					</div>
					<div className='column is-4'>
						<Message type={message.type} message={message.text} />
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
