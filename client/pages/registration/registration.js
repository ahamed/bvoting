import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../components/layout/layout';
import { connect } from 'react-redux';
import { handleInputChange } from '../../redux/user/user.actions';

import sha256 from 'crypto-js/sha256';
import swal from 'sweetalert';

import styles from './registration.module.scss';
import RegistrationBasic from '../../components/registrationBasic/registrationBasic';
import Message from '../../components/message/message';

const Registration = ({
	user: { name, mobile, secret, nid, region },
	web3: { web3, accounts, contracts },
	handleInputChange,
}) => {
	const [message, setMessage] = useState({
		text: 'Okay! Click Register button for completing registration.',
		type: 'success',
	});

	let timeout = null;

	useEffect(() => {
		let text = 'Missing required fields: ';
		if (!name) text += 'Voter Name, ';
		if (!mobile) text += 'Mobile, ';
		if (!nid) text += 'NID, ';
		if (!secret) text += 'Secret, ';
		if (!region) text += 'Region, ';

		if (name && mobile && nid && secret && region) {
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
	}, [name, mobile, nid, region]);

	const handleRegister = async event => {
		event.preventDefault();

		const confirm = await swal(
			'Are you sure that the provided information are authentic and correct? Careful about your information, you cannot edit this information in future.',
			{
				buttons: ['Check Again', 'Yes'],
			}
		);

		if (!confirm) return;

		if (name && mobile && nid && secret) {
			const rowString = name + mobile + nid + secret;
			const voterHash = '0x' + sha256(rowString).toString();

			const { registration } = contracts;
			const { methods } = registration;
			const isRegistered = await methods
				.isAlreadyRegistered(web3.utils.asciiToHex(nid))
				.call({
					from: accounts[0],
				});

			if (!isRegistered) {
				try {
					await methods
						.registerVoter(
							web3.utils.asciiToHex(nid),
							voterHash,
							web3.utils.asciiToHex(region)
						)
						.send({
							from: accounts[0],
						});
					setMessage({
						text: 'Registered successfully!',
						type: 'success',
					});
					const resp = await swal(
						'Success!',
						'Registration completed successfully!'
					);
					if (resp) {
						handleInputChange('name', '');
						handleInputChange('mobile', '');
						handleInputChange('nid', '');
						handleInputChange('secret', '');
						handleInputChange('region', '');
					}
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

	return (
		<Layout>
			<Head>
				<title>Voter Registration</title>
			</Head>
			<div className={styles.registration}>
				<div className='columns'>
					<div className='column is-8'>
						<div className='box'>
							<h1 className='subtitle'>Voter Registration</h1>
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
					<div className='column is-4'>
						<Message type={message.type} message={message.text} />
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

const mapDispatchToProps = dispatch => ({
	handleInputChange: (name, value) =>
		dispatch(handleInputChange(name, value)),
});

export default connect(mapPropsToState, mapDispatchToProps)(Registration);
