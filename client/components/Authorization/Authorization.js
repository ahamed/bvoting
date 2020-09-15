import React, { useEffect, useState } from 'react';

import FormInput from '../form-input/form-input';

const Authorization = ({ name, mobile, secret, nid, region, inputChange }) => {
	const handleChange = event => {
		event.preventDefault();
		let { name, value } = event.target;
		if (name === 'name') value = value.toUpperCase();
		inputChange(name, value);
	};

	return (
		<div className='voter-authorization'>
			<div className='columns'>
				<div className='column is-12'>
					<FormInput
						type='text'
						name='name'
						label='Voter Full Name'
						value={name}
						onChange={handleChange}
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
						onChange={handleChange}
					/>
				</div>
				<div className='column is-6'>
					<FormInput
						type='password'
						name='secret'
						label='Secret Key'
						value={secret}
						onChange={handleChange}
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
						onChange={handleChange}
					/>
				</div>
				<div className='column is-4'>
					<FormInput
						type='text'
						name='region'
						label='Region'
						value={region}
						onChange={handleChange}
					/>
				</div>
			</div>
		</div>
	);
};

export default Authorization;
