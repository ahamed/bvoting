import { takeLatest, call, put, all } from 'redux-saga/effects';
import getWeb3 from '../../getWeb3';
import MyContract from '../../ethereum/contracts/MyContract.json';

import web3ActionTypes from './web3.types';
import {
	web3InstanceOnSuccess,
	onInstantiationError,
	setContract,
	setAccounts,
} from './web3.actions';

const { INSTANTIATE_WEB3 } = web3ActionTypes;

export function* handleWeb3Instantiation() {
	try {
		// Get network provider and web3 instance.
		const web3 = yield getWeb3();
		console.log(web3);

		// Use web3 to get the user's accounts.
		const accounts = yield web3.eth.getAccounts();

		// Get the contract instance.
		const networkId = yield web3.eth.net.getId();
		const deployedNetwork = MyContract.networks[networkId];
		const instance = new web3.eth.Contract(
			MyContract.abi,
			deployedNetwork && deployedNetwork.address,
			{
				from: accounts[0],
				gas: 3000000,
			}
		);

		yield put(web3InstanceOnSuccess(web3));
		yield put(setAccounts(accounts));
		yield put(setContract({ name: 'MyContract', contract: instance }));
	} catch (error) {
		// Catch any errors for any of the above operations.
		put(onInstantiationError(error));
	}
}

export function* instantiateWeb3() {
	yield takeLatest(INSTANTIATE_WEB3, handleWeb3Instantiation);
}

export function* web3Saga() {
	yield all([call(instantiateWeb3)]);
}
