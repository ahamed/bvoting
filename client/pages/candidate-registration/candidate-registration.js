import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Head from 'next/head';
import Layout from '../../components/layout/layout';
import FormInput from '../../components/form-input/form-input';
import FormSelect from '../../components/form-input/form-select';
import Message from '../../components/message/message';

import parties from '../../data/parties';
import swal from 'sweetalert';
import { inTime } from '../../utils';

const CandidateRegistration = ({ web3: { web3, contracts, accounts } }) => {
	const [candidate, setCandidate] = useState({
		name: '',
		mobile: '',
		nid: '',
		region: '',
		partyId: '',
	});

	const [message, setMessage] = useState({
		text: '',
		type: '',
	});

	const { name, mobile, nid, region, partyId } = candidate;

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

		const { name, mobile, nid, region, partyId } = candidate;

		if (inTime()) {
			swal(
				'Invalid',
				'The voting period is starting. Candidates are not allowed for registration now!',
				'error'
			);
			return;
		}

		const confirm = await swal(
			'Are you sure that the provided information are authentic and correct? Careful about your information, you cannot edit this information in future.',
			{
				buttons: ['Check Again', 'Yes'],
			}
		);

		if (!confirm) return;

		try {
			const isRegisteredAsVoter = await registration.methods
				.isAlreadyRegistered(web3.utils.asciiToHex(nid))
				.call({ from: accounts[0] });

			if (isRegisteredAsVoter) {
				try {
					await methods
						.registerCandidate(
							web3.utils.asciiToHex(name),
							web3.utils.asciiToHex(mobile),
							web3.utils.asciiToHex(nid),
							web3.utils.asciiToHex(region),
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

					const resp = await swal(
						'Success',
						'Candidate added successfully!'
					);
					if (resp)
						setCandidate({
							name: '',
							mobile: '',
							nid: '',
							region: '',
							partyId: '',
						});
				} catch (e) {
					setMessage({
						type: 'error',
						text:
							'Something went wrong! This candidate may registered already or you are not permitted to perform this task.',
					});
					swal(
						'Error!',
						'Something went wrong! This candidate may registered already or you are not permitted to perform this task.',
						'error'
					);
				}
			} else {
				setMessage({
					type: 'error',
					text: 'Candidate must have to be a voter first!',
				});
				swal(
					'Notice!',
					'Candidate must have to be a voter first!',
					'info'
				);
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
				<div className='columns'>
					<div className='column is-8'>
						<div className='box'>
							<h1 className='subtitle'>Candidate Registration</h1>
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
								<div className='column is-4'>
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
								<div className='column is-8'>
									<FormInput
										type='text'
										name='nid'
										label='National ID'
										value={nid}
										onChange={inputChange}
									/>
								</div>
								<div className='column is-4'>
									<FormInput
										type='text'
										name='region'
										label='Region'
										value={region}
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

export default connect(mapPropsToState)(CandidateRegistration);
