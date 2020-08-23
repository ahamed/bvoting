import { connect } from 'react-redux';
import { handleInputChange } from '../../redux/user/user.actions';

import FormInput from '../form-input/form-input';

const RegistrationBasic = ({
	user: { name, secret, mobile, nid },
	handleInputChange,
}) => {
	const inputChange = event => {
		let { name, value } = event.target;
		if (name === 'name') value = value.toUpperCase();
		handleInputChange(name, value);
	};
	return (
		<div className='vb-registration-basics'>
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
					<FormInput
						type='password'
						name='secret'
						label='Secret Key'
						value={secret}
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
		</div>
	);
};

const mapStateToProps = state => ({
	user: state.user,
});

const mapDispatchToProps = dispatch => ({
	handleInputChange: (name, value) =>
		dispatch(handleInputChange(name, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationBasic);
