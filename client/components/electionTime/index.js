import React, { useState } from 'react';

import FormInput from '../form-input/form-input';
import swal from 'sweetalert';

export default function ElectionTime({ onShowProgress }) {
	const [start, setStart] = useState('');
	const [end, setEnd] = useState('');

	const handleElectionCreation = e => {
		e.preventDefault();

		const regex = /(\d{4})-(\d{2})-(\d{2})\s(\d{2})\:(\d{2})/;

		if (!regex.test(start) || !regex.test(end)) {
			swal('Error', 'Invalid date format', 'error');
			return;
		}

		const ls = localStorage || window.localStorage;

		ls.setItem('startDate', start);
		ls.setItem('endDate', end);

		onShowProgress(true);
	};

	return (
		<div className='election-time'>
			<div className='box '>
				<h2 className='subtitle has-text-centered'>
					Create the election and make it available for voters.
				</h2>
				<div className='columns'>
					<div className='column'>
						<FormInput
							type='text'
							name='start'
							label='Starting Time (YYYY-MM-DD HH:mm)'
							value={start}
							onChange={evt => setStart(evt.target.value)}
						/>
					</div>
					<div className='column'>
						<FormInput
							type='text'
							name='start'
							label='Ending Time (YYYY-MM-DD HH:mm)'
							pattern='(\d{4})-(\d{2})-(\d{2})\s(\d{2})(\d{2})'
							value={end}
							onChange={evt => setEnd(evt.target.value)}
						/>
					</div>
				</div>
				<div className='columns'>
					<div className='column has-text-centered'>
						<button
							className='button is-dark'
							onClick={handleElectionCreation}
						>
							Create Election
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
