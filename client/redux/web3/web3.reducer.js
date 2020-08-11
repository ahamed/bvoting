import web3ActionTypes from './web3.types';

const INITIAL_STATE = {
	web3: null,
	accounts: [],
	contracts: {},
	error: '',
};
const {
	WEB3_ON_SUCCESS,
	SET_ACCOUNTS,
	SET_CONTRACT,
	ON_INSTANTIATION_ERROR,
} = web3ActionTypes;

const web3Reducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case WEB3_ON_SUCCESS:
			return { ...state, web3: action.payload };

		case ON_INSTANTIATION_ERROR:
			return { ...state, error: action.payload };

		case SET_ACCOUNTS:
			return { ...state, accounts: action.payload };

		case SET_CONTRACT:
			const { name: contractName, contract } = action.payload;
			return {
				...state,
				contracts: { ...state.contracts, [contractName]: contract },
			};

		default:
			return state;
	}
};

export default web3Reducer;
