import React from 'react';

import styles from './form-input.module.scss';

const FormInput = ({ handleChange, label, ...otherProps }) => (
	<div className={styles.group}>
		<input
			className={styles['form-input']}
			onChange={handleChange}
			{...otherProps}
		/>
		{label ? (
			<label
				className={
					otherProps.value.length > 0
						? styles.shrink
						: styles['form-input-label']
				}
			>
				{label}
			</label>
		) : null}
	</div>
);

export default FormInput;
