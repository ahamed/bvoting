import web3ActionTypes from './web3.types';

const {
	INSTANTIATE_WEB3,
	WEB3_ON_SUCCESS,
	SET_ACCOUNTS,
	SET_CONTRACT,
	ON_INSTANTIATION_ERROR,
} = web3ActionTypes;

export const instantiateWeb3 = () => ({
	type: INSTANTIATE_WEB3,
});

export const web3InstanceOnSuccess = instance => ({
	type: WEB3_ON_SUCCESS,
	payload: instance,
});

export const onInstantiationError = error => ({
	type: ON_INSTANTIATION_ERROR,
	payload: error,
});

export const setContract = ({ name, contract }) => ({
	type: SET_CONTRACT,
	payload: { name, contract },
});

export const setAccounts = accounts => ({
	type: SET_ACCOUNTS,
	payload: accounts,
});
