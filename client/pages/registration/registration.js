import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../components/layout/layout';
import FormInput from '../../components/form-input/form-input';

import styles from './registration.module.scss';
import RegistrationBasic from '../../components/registrationBasic/registrationBasic';

const Registration = () => {
	return (
		<Layout>
			<Head>
				<title>Voter Registration</title>
			</Head>
			<div className={styles.registration}>
				<h1 className='title'>Voter Registration</h1>
				<div className='columns'>
					<div className='column is-6'>
						<RegistrationBasic />
						<div className='columns'>
							<div className='column'>
								<button className='button is-dark is-pulled-right'>
									Next
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default Registration;
