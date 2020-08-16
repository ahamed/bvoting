import { connect } from 'react-redux';
import { handleInputChange } from '../../redux/user/user.actions';

import FormInput from '../form-input/form-input';

const RegistrationBasic = ({
	user: { firstName, lastName, email, mobile, nid },
	handleInputChange,
}) => {
	const inputChange = event => {
		let { name, value } = event.target;
		if (name === 'firstName' || name === 'lastName')
			value = value.toUpperCase();
		handleInputChange(name, value);
	};
	return (
		<div className='vb-registration-basics'>
			<div className='columns'>
				<div className='column is-6'>
					<FormInput
						type='text'
						name='firstName'
						label='First Name'
						value={firstName}
						onChange={inputChange}
					/>
				</div>
				<div className='column is-6'>
					<FormInput
						type='text'
						name='lastName'
						label='Last Name'
						value={lastName}
						onChange={inputChange}
					/>
				</div>
			</div>

			<div className='columns'>
				<div className='column is-6'>
					<FormInput
						type='text'
						name='email'
						label='Email (optional)'
						value={email}
						onChange={inputChange}
					/>
				</div>
				<div className='column is-6'>
					<FormInput
						type='text'
						name='mobile'
						label='Mobile'
						value={mobile}
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
