import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../components/layout/layout';
import { connect } from 'react-redux';

import sha256 from 'crypto-js/sha256';

import styles from './registration.module.scss';
import RegistrationBasic from '../../components/registrationBasic/registrationBasic';

const Registration = ({
	user: { firstName, lastName, mobile, email, nid },
	web3: { web3, accounts, contracts },
}) => {
	const [message, setMessage] = useState({
		text: 'Okay! Click Register button for completing registration.',
		type: 'success',
	});
	const [voters, setVoters] = useState([]);

	useEffect(() => {
		getVoters();
		console.log('ComponentDidMount');
	}, [contracts]);

	useEffect(() => {
		let text = 'Missing required fields: ';

		if (!firstName) {
			text += 'First Name, ';
		}
		if (!lastName) {
			text += 'Last Name, ';
		}
		if (!mobile) {
			text += 'Mobile, ';
		}
		if (!nid) {
			text += 'NID, ';
		}

		if (firstName && lastName && mobile && nid) {
			setMessage({
				text:
					'Okay! Click Register button for completing registration.',
				type: 'success',
			});
		} else {
			setMessage({
				text: text,
				type: 'error',
			});
		}
	}, [firstName, lastName, mobile, nid]);

	const getVoters = async () => {
		try {
			if (contracts.registration) {
				const voters = await contracts.registration.methods
					.getVoters()
					.call({
						from: accounts[1],
					});
				setVoters(voters);
				console.log('voter retrieved');
			}
		} catch (e) {
			setMessage({
				text: e.message,
				type: 'error',
			});
			console.error(e);
		}
	};

	const handleRegister = async event => {
		event.preventDefault();

		if (firstName && lastName && mobile && nid) {
			const rowString = firstName + lastName + mobile + nid;
			const voterHash = '0x' + sha256(rowString).toString();

			// const account = web3.eth.accounts.privateKeyToAccount(
			// 	'0x802e4c0cbf96a726728383e2a972b417e9eda900bb03b2829cb4bad39cbf3d66'
			// );
			// console.log(account);
			// const newAccount = await eth.accounts.create(voterHash);
			// console.log(newAccount);

			const { registration } = contracts;
			const { methods } = registration;
			const isRegistered = await methods
				.isAlreadyRegistered(voterHash)
				.call({
					from: accounts[1],
				});

			if (!isRegistered) {
				try {
					await methods.registerVoter(voterHash).send({
						from: accounts[1],
					});
					setMessage({
						text: 'Registered successfully!',
						type: 'success',
					});
					getVoters();
				} catch (e) {
					setMessage({
						text: e.message,
						type: 'error',
					});
				}
			} else {
				setMessage({
					text: 'You are already registered!',
					type: 'error',
				});
			}
		}
	};

	const renderStatusIcon = type => {
		switch (type) {
			case 'success':
				return <i className='fas fa-check-circle'></i>;
			case 'warning':
				return <i className='fas fa-exclamation-circle'></i>;
			case 'info':
				return <i className='fas fa-info-circle'></i>;
			case 'error':
				return <i className='fas fa-times-circle'></i>;
			default:
				return <i className='fas fa-info-circle'></i>;
		}
	};

	return (
		<Layout>
			<Head>
				<title>Voter Registration</title>
			</Head>
			<div className={styles.registration}>
				<h1 className='title'>Voter Registration</h1>
				<div className='columns'>
					<div className='column is-6'>
						<div className='box'>
							<RegistrationBasic />
							<div className='columns'>
								<div className='column'>
									<button
										className='button is-dark is-pulled-right'
										onClick={handleRegister}
									>
										Register
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className='column is-6 has-text-centered'>
						<div className='box'>
							<h4 className='subtitle'>Registration Status</h4>
							<p
								className={`${styles['status-message']} ${
									styles['has-' + message.type]
								}`}
							>
								<span
									className={`icon has-text-${message.type}`}
								>
									{renderStatusIcon(message.type)}
								</span>
								{message.text}
							</p>
						</div>

						<div className='box'>
							<h4 className='subtitle'>Voters List</h4>
							{voters.length > 0 ? (
								<ol className={styles['voter-list']}>
									{voters.map(voter => (
										<li key={voter}>{voter}</li>
									))}
								</ol>
							) : (
								<span className=''>No Voter Registered!</span>
							)}
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

const mapPropsToState = state => ({
	user: state.user,
	web3: state.web3,
});

export default connect(mapPropsToState)(Registration);
