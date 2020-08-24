import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Head from 'next/head';
import Layout from '../../components/layout/layout';
import FormInput from '../../components/form-input/form-input';
import FormSelect from '../../components/form-input/form-select';
import Message from '../../components/message/message';

import parties from '../../data/parties';

const Candidate = ({ web3: { web3, contracts, accounts } }) => {
	const [candidate, setCandidate] = useState({
		name: '',
		mobile: '',
		nid: '',
		partyId: '',
	});

	const [message, setMessage] = useState({
		text: '',
		type: '',
	});

	useEffect(() => {
		if (contracts && contracts.CReg) getCandidates();
	}, [contracts, accounts]);

	const getCandidates = async () => {
		try {
			if (contracts.CReg) {
				const candidates = await contracts.CReg.methods
					.getCandidates()
					.call({
						from: accounts[0],
						gas: 8000000,
					});
			}
		} catch (e) {
			console.error(e);
		}
	};

	const { name, mobile, nid, partyId } = candidate;

	const inputChange = event => {
		event.preventDefault();
		let { name, value } = event.target;
		if (name === 'name') value = value.toUpperCase();
		setCandidate({ ...candidate, [name]: value });
	};

	const addCandidate = async event => {
		event.preventDefault();
		const {
			CReg: { methods },
		} = contracts;

		const { registration } = contracts;

		const { name, mobile, nid, partyId } = candidate;

		try {
			const isRegisteredAsVoter = await registration.methods
				.isAlreadyRegistered(web3.utils.fromAscii(nid))
				.call({ from: accounts[0] });

			if (isRegisteredAsVoter) {
				try {
					await methods
						.registerCandidate(
							name,
							mobile,
							web3.utils.fromAscii(nid),
							partyId >> 0
						)
						.send({
							from: accounts[0],
							gas: 8000000,
						});
					setMessage({
						type: 'success',
						text: 'Candidate added successfully!',
					});
				} catch (e) {
					setMessage({
						type: 'error',
						text: e,
					});
				}
			} else {
				setMessage({
					type: 'error',
					text: 'Candidate must have to be a voter first!',
				});
			}
		} catch (e) {
			setMessage({
				type: 'error',
				text: e,
			});
		}
	};

	return (
		<Layout>
			<Head>
				<title>Candidate Registration</title>
			</Head>
			<div className='candidate-registration'>
				<h1 className='title'>Candidate Registration</h1>
				<div className='columns'>
					<div className='column is-6'>
						<div className='box'>
							<div className='columns'>
								<div className='column is-12'>
									<FormInput
										type='text'
										name='name'
										label='Voter Full Name'
										value={name}
										onChange={inputChange}
									/>
								</div>
							</div>

							<div className='columns'>
								<div className='column is-6'>
									<FormInput
										type='text'
										name='mobile'
										label='Mobile'
										value={mobile}
										onChange={inputChange}
									/>
								</div>
								<div className='column is-6'>
									<FormSelect
										options={Object.values(parties).map(
											party => ({
												value: party.id,
												text: party.name,
											})
										)}
										label='Select a party'
										name='partyId'
										value={partyId}
										onChange={inputChange}
									/>
								</div>
							</div>

							<div className='columns'>
								<div className='column'>
									<FormInput
										type='text'
										name='nid'
										label='National ID'
										value={nid}
										onChange={inputChange}
									/>
								</div>
							</div>

							<div className='columns'>
								<div className='column'>
									<button
										className='button is-dark is-pulled-right'
										onClick={addCandidate}
									>
										Add Candidate
									</button>
								</div>
							</div>
						</div>
					</div>

					<div className='column is-6'>
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

export default connect(mapPropsToState)(Candidate);
