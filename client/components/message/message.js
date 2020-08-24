import React from 'react';

import styles from './message.module.scss';

const Message = ({ type, message }) => {
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
		<div className='box'>
			<h4 className='subtitle'>Status</h4>
			{message && (
				<p
					className={`${styles['status-message']} ${
						styles['has-' + type]
					}`}
				>
					<span className={`icon has-text-${type}`}>
						{renderStatusIcon(type)}
					</span>
					{message}
				</p>
			)}
		</div>
	);
};

export default Message;
