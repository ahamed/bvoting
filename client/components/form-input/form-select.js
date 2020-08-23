import React from 'react';

import styles from './form-input.module.scss';

const FormSelect = ({ handleChange, label, options, ...otherProps }) => (
	<div className={styles.group}>
		<select
			className={styles['form-input']}
			onChange={handleChange}
			{...otherProps}
		>
			<option value=''>{label}</option>
			{options.map(option => (
				<option value={option.value} key={option.value}>
					{option.text}
				</option>
			))}
		</select>
	</div>
);

export default FormSelect;
